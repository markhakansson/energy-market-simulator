const gauss = require('../../helper/gauss');
const Market = require('../../db/model/market');

const Logger = require('../../config/logger');

class MarketSim {
    constructor (name, price, production, maxBatteryCap, timeMultiplier) {
        this.market = new Market({
            name: name,
            timestamp: Date.now(),
            demand: 0, // the sum of all households' demand for electricity
            status: 'startup!',
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
            plantInOperation: true,
            manualProduction: 0,
            manualPrice: 0
        });

        // Public simulation variables
        // Useful for things that will be saved in a future tick
        this.prevDemand = 0;
        this.marketOutput = 0;
        this.startupInitiated = false;
        this.timeMultiplier = timeMultiplier;
        this.demand = 0;
        this.deltaDemand = 0;
        this.production = 0;
        this.consumption = 0;
        this.price = 0;
        this.status = 'startup';
        this.plantInOperation = true;
    }

    /**
     * Gets the current data for this model in the database. If no data is found,
     * it tries to create a new entry instead. If data can't be saved to the database, an error will be thrown.
     */
    async fetchData () {
        const self = this;
        await Market.findOne({ name: self.market.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) throw err;
            if (doc) {
                self.market = doc;
            } else {
                self.market.save((err) => {
                    if (err) {
                        Logger.error('Could not save market to database: ' + err);
                        throw err;
                    }
                });
            }
        });
        this.marketOutput = 0;
        this.status = self.market.status;
        this.plantInOperation = self.market.plantInOperation;
        this.marketOutput = 0;
        this.status = self.market.status;
    }

    /**
     * Request eletricity to buy from the market. Returns the requested amount if possible, else it returns the
     * amount that the market is able to provide.
     * @param {*} demand The amount of electricity to request to buy.
     */
    buy (demand) {
        const self = this.market;

        if (demand < 0 || demand == null) {
            Logger.error(
                'In market [' + self.name + '] when receiving a buy order, expected postive Number. Recieved: ' +
                demand + '.'
            );
        } else {
            this.demand += demand;

            // Needs to reset the demand for each tick.
            setTimeout(() => {
                this.demand -= demand;
            }, 0.95 * this.timeMultiplier);

            // Use market output if possible, else try to use the battery
            let usableEnergy = this.marketOutput - demand;
            if (usableEnergy >= 0) {
                this.marketOutput -= demand;
                return demand;
            } else {
                usableEnergy = this.marketOutput + this.useBattery(demand - this.marketOutput);
                this.marketOutput = 0;
                return usableEnergy;
            }
        }
    }

    /**
     * Offer electricity to sell to the market.
     * @param {*} demand The amount of electricity to offer to sell.
     */
    sell (demand) {
        const self = this.market;

        if (demand < 0 || demand == null) {
            Logger.error(
                'In market [' + self.name + '] when receiving a sell order, expected postive Number. Recieved: ' +
                demand + '.'
            );
        } else {
            this.demand -= demand;

            this.chargeBattery(self.fillBatteryRatio * demand);
            this.marketOutput += ((1 - self.fillBatteryRatio) * demand);

            // Needs to reset the demand for each tick.
            setTimeout(() => {
                this.demand += demand;
            }, 0.95 * this.timeMultiplier);
        }
        return 0;
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

        if (self.autopilot) {
            self.price = self.recommendedPrice;
        } else {
            self.price = self.manualPrice;
        }

        // Power plant has been stopped
        if (!self.startUp) {
            this.plantInOperation = false;
            this.status = 'stopped!';

        // Power plant is running
        } else if (this.plantInOperation || this.startupInitiated) {
            if (self.autopilot) {
                self.price = self.recommendedPrice;
            }

            // Needs to save the current tick values to be used in the settimeout
            const currTickRecommendedProduction = self.recommendedProduction;
            const currTickManualProduction = self.manualProduction;

            setTimeout(() => {
                this.status = 'running!';

                if (self.autopilot) {
                    this.production = currTickRecommendedProduction;
                } else {
                    this.production = currTickManualProduction;
                }

                this.consumption = this.production / 10;
                this.marketOutput = (1 - self.fillBatteryRatio) * this.production;
                this.chargeBattery(self.fillBatteryRatio * this.production);
            }, 2 * this.timeMultiplier);
        // Startup sequence initiated
        } else if (self.startUp && !this.startupInitiated) {
            this.status = 'starting up...';
            this.startupInitiated = true;

            setTimeout(() => {
                this.plantInOperation = true;
                this.startupInitiated = false;
            }, 2 * this.timeMultiplier);
        }
    }

    /**
     * Sets the recommended simulation values. Used by the autopilot
     * to decide how much to produce and the price.
     */
    setRecommendations () {
        const self = this.market;

        if (this.demand > 0) {
            self.recommendedProduction = 5.0 * this.demand;
        } else {
            self.recommendedProduction = 0;
        }
        // Recommended price is previous price plus 1 percent of delta demand
        const recommendedPrice = self.price + 0.01 * (this.prevDemand - this.demand);
        if (recommendedPrice > 0) {
            self.recommendedPrice = recommendedPrice;
        } else {
            self.recommendedPrice = 0;
        }
    }

    update () {
        let self = this.market;

        this.deltaDemand = this.prevDemand - this.demand;
        this.prevDemand = this.demand;

        self = new Market({
            name: self.name,
            timestamp: Date.now(),
            demand: this.demand,
            status: this.status,
            startUp: self.startUp,
            price: self.price,
            production: this.production,
            consumption: this.consumption,
            currBatteryCap: self.currBatteryCap,
            maxBatteryCap: self.maxBatteryCap,
            fillBatteryRatio: self.fillBatteryRatio,
            autopilot: self.autopilot,
            recommendedPrice: self.recommendedPrice,
            recommendedProduction: self.recommendedProduction,
            plantInOperation: this.plantInOperation,
            manualProduction: self.manualProduction,
            manualPrice: self.manualPrice
        });
        self.save((err) => {
            if (err) {
                Logger.error('Could not save market to database: ' + err);
                throw err;
            } else {
                console.log('Market ' + self.name +
                    '\n current demand: ' + this.demand +
                    '\n status: ' + this.status +
                    '\n startup: ' + self.startUp +
                    '\n In operation: ' + this.plantInOperation +
                    '\n Autopilot enabled: ' + self.autopilot +
                    '\n Time: ' + self.timestamp.toString() +
                    '\n Producing: ' + this.production + ' Wh' +
                    '\n Consuming: ' + this.consumption + ' Wh' +
                    '\n Price per Wh is: ' + self.price + ' SEK' +
                    '\n CurrentBatteryCap: ' + self.currBatteryCap + ' Wh' +
                    '\n MaxBatteryCap: ' + self.maxBatteryCap + ' Wh' +
                    '\n Recommended price: ' + self.recommendedPrice + ' SEK' +
                    '\n Recommended production: ' + self.recommendedProduction + ' Wh' +
                    '\n Market output: ' + this.marketOutput + ' Wh' +
                    '\n Fill battery rate: ' + self.fillBatteryRatio
                )
            }
        });
    }
}

module.exports = MarketSim;
