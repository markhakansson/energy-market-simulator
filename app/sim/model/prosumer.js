const gauss = require('../../helper/gauss');
var tools = require('../../helper/tools');
var Prosumer = require('../../db/model/prosumer');

const Logger = require('../../config/logger');

class ProsumerSim {
    constructor (name, market, timeMultiplier) {
        this.prosumer = new Prosumer({
            name: name,
            market: market.market.name,
            timestamp: Date.now(),
            consumption: 0,
            production: 0,
            currBatteryCap: 0,
            maxBatteryCap: 10000,
            fillBatteryRatio: 0.0,
            useBatteryRatio: 0.0,
            bought: 0.0,
            blackout: false,
            turbineStatus: 'WORKING',
            turbineWorking: true,
            turbineBreakPercent: 0.05,
            blocked: false,
            blockedTimer: 0.0
        });
        this.market = market;

        this.timeMultiplier = timeMultiplier;

        this.turbineStatus = 'WORKING';
        this.turbineWorking = true;
        this.blocked = false;
        this.blockTimerStarted = false;
    }

    /**
     * Gets the current data for this model in the database. If no data is found,
     * it tries to create a new entry instead.
     */
    async fetchData () {
        const self = this;

        await Prosumer.findOne({ name: this.prosumer.name }).sort({ timestamp: -1 }).exec()
            .then(
                async doc => {
                    if (doc == null) {
                        throw new Error('Prosumer does not exist');
                    } else if (doc.market === 'none') {
                        Logger.error('Matching prosumer with name [' + self.prosumer.name + '] was not found in the database!');
                        await self.prosumer.save().catch((err) => {
                            throw err;
                        })
                    } else {
                        self.prosumer = doc;
                        self.prosumer.bought = 0;
                    }
                },
                async err => {
                    throw new Error(err);
                }
            )
            .catch(
                async err => {
                    throw err;
                }
            )

        if (self.prosumer.blocked && !self.blockTimerStarted) {
            self.blocked = true;
            self.blockTimerStarted = true;

            setTimeout(() => {
                self.blocked = false;
                // Needs the second timeout or else it will break
                setTimeout(() => {
                    self.blockTimerStarted = false;
                }, this.timeMultiplier);
            }, self.prosumer.blockedTimer * 1000);
        }
    }

    /**
     * Call this to randomize the chance of the turbine to break. This function will call the
     * function 'callTurbineRepairman' which will fix the turbine some time in the future.
     */
    randomizeTurbineBreaking () {
        const self = this.prosumer;
        if (this.turbineWorking) {
            const rand = Math.random();

            if (rand <= self.turbineBreakPercent) {
                self.production = 0;
                this.turbineWorking = false;
                this.turbineStatus = 'BROKEN! REPAIRMAN CALLED!';
                this.callTurbineRepairman();
            }
        }

        return this.turbineWorking;
    }

    generateProduction (windSpeed) {
        const self = this.prosumer;

        if (windSpeed < 0 || windSpeed == null) {
            Logger.error(
                'When generating production in prosumer [' + self.name +
                '], expected positive Number. Received: ' + windSpeed + '.'
            );
        } else if (this.randomizeTurbineBreaking()) {
            self.production = windSpeed * 250;
            const prodDiff = self.production - self.consumption;

            // Check if there is an excessive production of power
            if (prodDiff > 0) {
                this.chargeBattery(self.fillBatteryRatio * prodDiff);
                this.sellToMarket((1 - self.fillBatteryRatio) * prodDiff);
            }
        }
    }

    generateConsumption () {
        const self = this.prosumer;
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        const consumption = self.consumption / 100;
        let arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller wind speeds.
        if (consumption > 0) {
            if (consumption < 10) {
                arr = [0.8 * consumption, 1.2 * consumption, 1.4 * consumption];
            } else if (consumption < 40) {
                arr = [0.8 * consumption, consumption, 1.2 * consumption];
            } else {
                arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
            }

            try {
                self.consumption = gauss.gaussLimit(arr, 4, 0.05, 0, 60) * 100;
            } catch (err) {
                Logger.error('When genereting gaussian distribution in prosumer [' + self.prosumer.name + '] caught error: ' + err);
                self.consumption = Math.random() * 5000;
            }
        // Rare cases for when consumption is zero
        } else {
            self.consumption = Math.random() * 5000;
        }

        const consDiff = self.consumption - self.production;

        // Check if household's demand exceeds production
        if (consDiff > 0) {
            this.useBattery(self.useBatteryRatio * consDiff);
            this.buyFromMarket((1 - self.useBatteryRatio) * consDiff);
        }
    }

    handleOverproduction () {
        const self = this.prosumer;
        const prodDiff = self.production - self.consumption;

        // Check if there is an excessive production of power
        if (prodDiff > 0) {
            this.chargeBattery(self.fillBatteryRatio * prodDiff);
            this.sellToMarket((1 - self.fillBatteryRatio) * prodDiff);
        }
    }

    /**
     * Repairs the turbine in the future. Updates the turbine status after some time.
     * Is an asynchronous function.
     */
    callTurbineRepairman () {
        tools.sleep(2 * this.timeMultiplier).then(() => {
            this.turbineStatus = 'REPAIRMAN ON THE WAY...';
        });
        tools.sleep(3 * this.timeMultiplier).then(() => {
            this.turbineStatus = 'REPAIRING...';
        });
        tools.sleep(5 * this.timeMultiplier).then(() => {
            this.turbineWorking = true;
            this.turbineStatus = 'WORKING';
        });
    }

    /**
     * Fills up the house's battery with amount.
     * If batter is full, sells the rest to the market.
     * If energy is negative or null it will be ignored.
     * @param {*} energy The amount to charge.
     */
    chargeBattery (energy) {
        const self = this.prosumer;

        console.log('# Charge battery energy: ' + energy);

        if (energy < 0 || energy == null) {
            Logger.error(
                'When charging battery in prosumer [' + self.name +
                '], expected positive Number. Recieved ' + energy + '.'
            );
        } else if (self.currBatteryCap + energy >= self.maxBatteryCap) {
            console.log('# Battery is full, selling to market');
            self.currBatteryCap = self.maxBatteryCap;
            this.sellToMarket(self.currBatteryCap + energy - self.maxBatteryCap);
        } else {
            console.log('# Adding to energy to battery');
            self.currBatteryCap += energy;
        }
    }

    /**
     * Withdraws a certain amount of energy from the house's battery.
     * If not enough energy present, buys the rest from the market.
     * If energy is negative or null it will be ignored.
     * @param {*} energy The amount to use up.
     */
    useBattery (energy) {
        const self = this.prosumer;

        if (energy < 0 || energy == null) {
            Logger.error(
                'When using energy from battery in prosumer [' + self.name +
                '], expected positive Number. Recieved ' + energy + '.'
            );
        } else if (self.currBatteryCap - energy < 0) {
            const buyEnergy = energy - self.currBatteryCap;
            this.buyFromMarket(buyEnergy);
            self.currBatteryCap = 0;
        } else {
            self.currBatteryCap -= energy;
            self.blackout = false;
        }
    }

    /**
     * Buys the given amount of energy from the connected market.
     * If bought energy from the market is not enough, the consumption
     * will automatically lower to the received energy.
     * @param {*} energy Amount to buy. Should be bigger than zero.
     */
    buyFromMarket (energy) {
        const self = this.prosumer;
        const boughtEnergy = this.market.buy(energy);

        if (boughtEnergy == null) {
            Logger.error(
                'When buying energy from market in prosumer [' + self.name +
                '], expected Number but received "null".'
            );
        } else if (boughtEnergy < 0) {
            Logger.error(
                'When buying energy from market in prosumer [' + self.name +
                '], expected 0 or positive Number. Received negative Number.'
            );
        } else if (boughtEnergy < energy) {
            // self.consumption -= (energy - boughtEnergy);
            self.bought += boughtEnergy;
            self.blackout = true;
        } else {
            self.bought += boughtEnergy;
            self.blackout = false;

            if (self.currBatteryCap === 0) {
                self.blackout = true;
            }
        }
    }

    /**
     * Sells the chosen amount of energy to the connected market.
     * If prosumer is blocked they will not be allowed to sell.
     * @param {*} energy Amount to sell.
     */
    sellToMarket (energy) {
        if (energy > 0 && !this.blocked) {
            this.market.sell(energy);
        } else if (energy < 0 || energy == null) {
            Logger.error('When selling to market in prosumer [' + this.prosumer.name + '] energy was negative!');
        }
    }

    /**
     * Saves this model to the database.
     */
    update () {
        let self = this.prosumer;

        self = new Prosumer({
            name: self.name,
            market: self.market,
            timestamp: Date.now(),
            consumption: self.consumption,
            production: self.production,
            currBatteryCap: self.currBatteryCap,
            maxBatteryCap: self.maxBatteryCap,
            fillBatteryRatio: self.fillBatteryRatio,
            useBatteryRatio: self.useBatteryRatio,
            bought: self.bought,
            blackout: self.blackout,
            turbineStatus: this.turbineStatus,
            turbineWorking: this.turbineWorking,
            turbineBreakPercent: self.turbineBreakPercent,
            blocked: this.blocked,
            blockedTimer: self.blockedTimer
        });
        self.save((err) => {
            if (err) {
                Logger.error('Could not save prosumer to database: ' + err);
                throw err;
            } else {
                console.log(self.name + ' is connected to ' + self.market +
                '\n Time: ' + self.timestamp.toString() +
                '\n Producing: ' + self.production + ' Wh' +
                '\n Consuming: ' + self.consumption + ' Wh' +
                '\n Bought energy: ' + self.bought + ' Wh' +
                '\n Price per Wh is: ' + this.market.market.price + ' SEK' +
                '\n Battery cap: ' + self.currBatteryCap + ' Wh' +
                '\n Max battery cap: ' + self.maxBatteryCap + ' Wh' +
                '\n Blackout: ' + self.blackout +
                '\n Turbine status: ' + this.turbineStatus +
                '\n Fill battery ratio: ' + self.fillBatteryRatio +
                '\n Use battery ratio: ' + self.useBatteryRatio +
                '\n Blocked from market: ' + this.blocked +
                '\n Turbine break percent: ' + self.turbineBreakPercent
                )
            }
        });
    }
}

module.exports = ProsumerSim;
