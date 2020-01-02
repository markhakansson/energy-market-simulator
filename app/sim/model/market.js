const gauss = require('../../helper/gauss');
const Market = require('../../db/model/market');

const Logger = require('../../config/logger');

class MarketSim {
    constructor (name, price, production, maxBatteryCap, timeMultiplier) {
        this.market = new Market({
            name: name,
            timestamp: Date.now(),
            demand: 0, // the sum of all households' demand for electricity
            status: 'built',
            startUp: true,
            price: price,
            production: production,
            consumption: production / 10,
            currBatteryCap: 0,
            maxBatteryCap: maxBatteryCap,
            fillBatteryRatio: 0.0,
            autopilot: true,
            recommendedPrice: price,
            recommendedProduction: production,
            plantInOperation: true
        });

        this.prevDemand = 0;
        this.marketOutput = 0; // resets every tick
        this.startupInitiated = false;
        this.timeMultiplier = timeMultiplier;
        this.demand = 0;
    }

    /**
     * Gets the current data for this model in the database. If no data is found,
     * it tries to create a new entry instead. If data can't be saved to the database, an error will be thrown.
     */
    async fetchData () {
        const self = this;
        await Market.findOne({ name: self.market.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) {
                Logger.warn('Matching market with name [' + self.market.name + '] was not found in the database!');
                self.market.save().catch((err) => {
                    throw err;
                });
            } else {
                self.market = doc;
            }
        })
    }

    /**
     * Request eletricity to buy from the market. Returns the requested amount if possible, else it returns the
     * amount that the market is able to provide.
     * @param {*} demand The amount of electricity to request to buy.
     */
    buy (demand) {
        const self = this.market;

        if (demand < 0 || demand == null) {
            Logger.warn(
                'In market [' + self.name + '] when receiving a buy order, expected postive Number. Recieved: ' +
                demand + '.'
            );
        }

        // Demand increases this tick and decreases later to not
        // let the demand increase into infinity if no one is selling.
        this.demand += demand;
        setTimeout(() => {
            this.demand -= demand;
        }, 1.25 * this.timeMultiplier);

        // If plant is running, use the up the current production.
        if (self.plantInOperation) {
            let usableEnergy = self.marketOutput - demand;
            if (usableEnergy >= 0) {
                self.marketOutput -= demand;
                return demand;
            } else {
                usableEnergy = self.marketOutput + this.useBattery(demand - self.marketOutput);
                self.marketOutput = 0;
                return usableEnergy;
            }
        // If plant is stopped, use up the battery instead.
        } else {
            return this.useBattery(demand);
        }
    }

    /**
     * Offer electricity to sell to the market.
     * @param {*} demand The amount of electricity to offer to sell.
     */
    sell (demand) {
        const self = this.market;

        if (demand < 0 || demand == null) {
            Logger.warn(
                'In market [' + self.name + '] when receiving a sell order, expected postive Number. Recieved: ' +
                demand + '.'
            );
        }

        console.log('#### RECIEVED ENERGY: ' + demand + ' ####');

        // Needs to automatically reset the demand in the future, to
        // not let demand decrease into negative infinity if no one is buying.
        this.demand -= demand;
        this.marketOutput += demand;

        setTimeout(() => {
            //const self = this.market;
            console.log('@@@ DEMAND IN SET TIMEOUT IS: ' + demand + ' @@@');
            console.log(this.demand);
            this.demand += demand;
            console.log(this.demand); // this will be overwritten by the next fetchData call!!!
        }, 1.25 * this.timeMultiplier);
    }

    /**
     * Fills up the markets's battery with amount.
     * If energy is negative or null it will be ignored.
     * @param {*} energy The amount to charge.
     */
    chargeBattery (energy) {
        const self = this.market;

        if (energy < 0 || energy == null) {
            Logger.error(
                'When charging battery in market [' + self.name +
                '], expected positive Number. Recieved ' + energy + '.'
            );
        } else if (self.currBatteryCap + energy >= self.maxBatteryCap) {
            self.currBatteryCap = self.maxBatteryCap;
            this.marketOutput += self.currBatteryCap + energy - self.maxBatteryCap;
        } else {
            self.currBatteryCap += energy;
        }
    }

    /**
     * Withdraws a certain amount of energy from the markets's battery.
     * If energy is negative or null it will be ignored.
     * Returns the energy possible to use from the battery.
     * @param {*} energy The amount to use up.
     */
    useBattery (energy) {
        const self = this.market;

        if (energy < 0 || energy == null) {
            Logger.error(
                'When using energy from battery in market [' + self.name +
                '], expected positive Number. Recieved ' + energy + '.'
            );
            return 0;
        } else if (self.currBatteryCap - energy < 0) {
            const usableEnergy = self.currBatteryCap;
            self.currBatteryCap = 0;
            return usableEnergy;
        } else {
            self.currBatteryCap -= energy;
            return energy;
        }
    }

    generateProduction () {
        const self = this.market;

        // Set simulation recommendations first
        this.setRecommendations();

        // Power plant has been stopped
        if (!self.startUp) {
            self.plantInOperation = false;
            self.status = 'stopped!';

        // Power plant is running
        } else if (self.plantInOperation) {
            // Fix so plant consumption is also taken into account!
            self.status = 'running!';

            if (self.autopilot) {
                self.production = self.recommendedProduction;
                self.price = self.recommendedPrice;
            }

            this.marketOutput = (1 - self.fillBatteryRatio) * self.production;
            this.chargeBattery(self.fillBatteryRatio * self.production);

        // Startup sequence initiated
        } else if (self.startUp && !this.startupInitiated) {
            self.status = 'starting up...';
            this.startupInitiated = true;

            setTimeout(() => {
                self.plantInOperation = true;
                this.startupInitiated = false;
            }, 30 * this.timeMultiplier);
        }
    }

    /**
     * Sets the recommended simulation values. Used by the autopilot
     * to decide how much to produce and the price.
     */
    setRecommendations () {
        const self = this.market;

        if (this.demand > 0) {
            self.recommendedProduction = 1.2 * this.demand;
        } else {
            self.recommendedProduction = 0;
        }

        console.log('Prev demand: ' + this.prevDemand);
        console.log('This demand: ' + this.demand);

        const recommendedPrice = self.price + 0.01 * (this.prevDemand - this.demand);
        console.log('Recommended price: ' + recommendedPrice);
        if (recommendedPrice > 0) {
            self.recommendedPrice = recommendedPrice;
        } else {
            self.recommendedPrice = 0;
        }
    }

    update () {
        let self = this.market;

        this.prevDemand = this.demand;

        self = new Market({
            name: self.name,
            timestamp: Date.now(),
            demand: this.demand,
            status: self.status,
            startUp: self.startUp,
            price: self.price,
            production: self.production,
            consumption: self.production / 10,
            currBatteryCap: self.currBatteryCap,
            maxBatteryCap: self.maxBatteryCap,
            fillBatteryRatio: self.fillBatteryRatio,
            autopilot: self.autopilot,
            recommendedPrice: self.recommendedPrice,
            recommendedProduction: self.recommendedProduction,
            plantInOperation: self.plantInOperation
        });

        self.save((err) => {
            if (err) {
                Logger.error('Could not save market to database: ' + err);
                throw err;
            } else {
                console.log('Market ' + self.name +
                    '\n current demand: ' + this.demand +
                    '\n status: ' + self.status +
                    '\n startup: ' + self.startUp +
                    '\n In operation: ' + self.plantInOperation +
                    '\n Autopilot enabled: ' + self.autopilot +
                    '\n Time: ' + self.timestamp.toString() +
                    '\n Producing: ' + self.production + ' Wh' +
                    '\n Consuming: ' + self.consumption + ' Wh' +
                    '\n Price per Wh is: ' + self.price + ' SEK' +
                    '\n CurrentBatteryCap: ' + self.currBatteryCap + ' Wh' +
                    '\n MaxBatteryCap: ' + self.maxBatteryCap + ' Wh' +
                    '\n Recommended price: ' + self.recommendedPrice + ' SEK' +
                    '\n Recommended production: ' + self.recommendedProduction + ' Wh' +
                    '\n Market output: ' + this.marketOutput
                )
            }
        });
    }
}

module.exports = MarketSim;
