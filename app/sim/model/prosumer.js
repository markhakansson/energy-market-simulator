const gauss = require('../../helper/gauss');
var tools = require('../../helper/tools');
var Prosumer = require('../../db/model/prosumer');

class ProsumerSim {
    constructor (name, market, timeMultiplier) {
        this.prosumer = { name: name };

        this.market = market;

        this.timeMultiplier = timeMultiplier;
    }

    /**
     * Gets the current data for this model in the database.
     */
    async fetchData () {
        const self = this;
        await Prosumer.findOne({ name: this.prosumer.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) {
                throw err;
            } else {
                self.prosumer = doc;
            }
        });
    }

    /**
     * Call this to randomize the chance of the turbine to break. This function will call the
     * function 'callTurbineRepairman' which will fix the turbine some time in the future.
     */
    randomizeTurbineBreaking () {
        const self = this.prosumer;
        if (self.turbineWorking) {
            const rand = Math.random();

            if (rand < self.turbineBreakagePercent) {
                self.production = 0;
                self.turbineWorking = false;
                self.turbineStatus = 'BROKEN! REPAIRMAN CALLED!';
                this.callTurbineRepairman();
            }
        }

        return self.turbineWorking;
    }

    generateProduction (windSpeed) {
        const self = this.prosumer;
        if (this.randomizeTurbineBreaking()) {
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
            if (consumption < 40) {
                arr = [0.8 * consumption, consumption, 1.2 * consumption];
            } else {
                arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
            }

            self.consumption = gauss.gaussLimit(arr, 4, 0.05, 0, 60) * 100;
            const consDiff = self.consumption - self.production;

            // Check if household's demand exceeds production
            if (consDiff > 0) {
                this.useBattery(self.useBatteryRatio * consDiff);
                this.buyFromMarket((1 - self.useBatteryRatio) * consDiff);
            }
        } else {
            self.consumption = Math.random() * Math.random() * 5000;
        }
    }

    /**
     * Repairs the turbine in the future. Updats the turbine status after some time.
     */
    callTurbineRepairman () {
        const self = this.prosumer;
        tools.sleep(2 * this.timeMultiplier).then(() => {
            self.turbineStatus = 'REPAIRMAN ON THE WAY...';
        });
        tools.sleep(this.timeMultiplier).then(() => {
            self.turbineStatus = 'REPAIRING...';
        });
        tools.sleep(2 * this.timeMultiplier).then(() => {
            self.turbineWorking = true;
            self.turbineStatus = 'WORKING!';
        });
    }

    /**
     * Fills up the house's battery with amount.
     * @param {*} energy The amount to charge.
     */
    chargeBattery (energy) {
        const self = this.prosumer;
        if (self.currBatteryCap + energy >= self.maxBatteryCap) {
            self.currBatteryCap = self.maxBatteryCap;
            this.sellToMarket(self.currBatteryCap + energy - self.maxBatteryCap);
        } else {
            self.currBatteryCap += energy;
        }
    }

    /**
     * Withdraws a certain amount of energy from the house's battery.
     * @param {*} energy The amount to use up.
     */
    useBattery (energy) {
        const self = this.prosumer;
        if (self.currBatteryCap - energy < 0) {
            const buyEnergy = energy - self.currBatteryCap;
            this.buyFromMarket(buyEnergy);
            self.currBatteryCap = 0;
        } else {
            self.currBatteryCap -= energy;
        }
    }

    /**
     * Buys the given amount of energy from the connected market.
     * @param {*} energy Amount to buy.
     */
    buyFromMarket (energy) {
        const self = this.prosumer;
        const boughtEnergy = this.market.buy(energy);
        self.bought = boughtEnergy;
        if (boughtEnergy < energy) {
            self.consumption -= (energy - boughtEnergy);
        }
    }

    /**
     * Sells the chosen amount of energy to the connected market.
     * @param {*} energy Amount to sell.
     */
    sellToMarket (energy) {
        this.market.sell(energy);
    }

    /**
     * Saves this model to the database.
     */
    update () {
        let self = this.prosumer;

        console.log('Prosumer: \n' + this);

        self = new Prosumer({
            name: self.name,
            market: self.market,
            timestamp: Date.now(),
            consumption: self.consumption,
            production: self.production,
            currBatteryCap: self.currBatteryCap,
            maxBatteryCap: self.batterySize,
            fillBatteryRatio: self.fillBatteryRatio,
            useBatteryRatio: self.useBatteryRatio,
            bought: self.bought,
            blackout: self.blackout,
            turbineStatus: self.turbineStatus,
            turbineWorking: self.turbineWorking,
            turbineBreakPercent: self.turbineBreakagePercent
        });

        self.save((err) => {
            if (err) {
                throw err;
            } else {
                console.log(self.name + ' is connected to ' + self.market +
                '\n Time: ' + self.timestamp.toString() +
                '\n Producing: ' + self.production + ' Wh' +
                '\n Consuming: ' + self.consumption + ' Wh' +
                '\n Bought energy: ' + self.bought + ' Wh' +
                '\n Price per Wh is: ' + this.market.market.price + ' SEK' +
                '\n Battery: ' + self.currBatteryCap + ' Wh' +
                '\n Blackout: ' + self.blackout +
                '\n Turbine status: ' + self.turbineStatus
                )
            }
        });
    }
}

module.exports = ProsumerSim;
