var gauss = require('../../helper/gauss')
var tools = require('../../helper/tools');
var Consumer = require('../../db/model/consumer');

const Logger = require('../../config/logger');

class ConsumerSim {
    constructor (name, market, timeMultiplier) {
        this.consumer = new Consumer({
            name: name,
            market: market.market.name,
            timestamp: Date.now(),
            consumption: 2000,
            bought: 0,
            blackout: false,
            retrying: false,
            demand: 0
        });

        this.market = market;
        this.timeMultiplier = timeMultiplier;
        this.retrying = false;
        this.blackout = false;
        this.demand = 0;
        this.bought = 0;
        this.consumption = 0;
    }

    /**
     * Gets the latest version of this model from the database. If no data is found,
     * it tries to create a new entry instead.
     */
    async fetchData () {
        const self = this;
        await Consumer.findOne({ name: this.consumer.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) {
                Logger.warn('Matching consumer with name [' + self.consumer.name + '] was not found in the database!');
                self.consumer.save().catch((err) => {
                    throw err;
                });
                // throw new Error('Matching consumer with name [' + self.consumer.name + '] was not found in the database!');
            } else {
                self.consumer = doc;
            }
        });
    }

    generateConsumption () {
        const self = this.consumer;
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        let consumption = self.consumption / 1000;
        let arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller consumptions.
        if (consumption > 0) {
            if (consumption < 0.1) {
                arr = [1.5 * consumption, 2.0 * consumption, 2.5 * consumption];
            } else if (consumption < 1.0) {
                arr = [consumption, 1.2 * consumption, 1.4 * consumption];
            } else if (consumption < 4.0) {
                arr = [0.8 * consumption, consumption, 1.2 * consumption];
            } else {
                arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
            }

            try {
                consumption = gauss.gauss(arr, 4, 0.05) * 1000;
            } catch (err) {
                Logger.error('When genereting gaussian distribution in consumer [' + self.consumer.name + '] caught error: ' + err);
                arr = [0.8 * 3, 3, 1.2 * 3];
                consumption = gauss.gauss(arr, 4, 0.05) * 1000;
            }
            this.buyFromMarket(consumption);

        // If blackout has occured, try to buy from market in the future
        } else if (this.blackout && !this.retrying) {
            this.retrying = true;

            tools.sleep(2 * this.timeMultiplier).then(() => {
                arr = [0.8 * 3, 3, 1.2 * 3];
                consumption = gauss.gauss(arr, 4, 0.05) * 1000;
                this.buyFromMarket(consumption);
                this.retrying = this.blackout;
            });
        // Rare case if consumption is zero while not blackouted
        } else if (consumption === 0 && !this.blackout) {
            arr = [0.8 * 3, 3, 1.2 * 3];
            consumption = gauss.gauss(arr, 4, 0.05) * 1000;
            this.buyFromMarket(consumption);
        }
    }

    buyFromMarket (energy) {
        const self = this.consumer;
        const boughtEnergy = this.market.buy(energy);
        this.demand = energy;
        self.bought = boughtEnergy;

        if (boughtEnergy === 0 || boughtEnergy == null || boughtEnergy < energy) {
            this.consumption = 0;
            this.blackout = true;
        } else if (boughtEnergy < 0) {
            Logger.warn(
                'When buying energy from market in consumer [' + self.name +
                '], expected positive Number. Received negative Number.'
            );
            this.consumption = 0;
            this.blackout = true;
        } else {
            this.consumption = energy;
            this.blackout = false;
        }
    }

    /**
     * Saves the mdoel in its current state to the database.
     */
    update () {
        let self = this.consumer;
        self = new Consumer({
            name: self.name,
            market: self.market,
            timestamp: Date.now(),
            consumption: self.consumption,
            bought: self.bought,
            blackout: this.blackout,
            retrying: this.retrying,
            demand: this.demand
        });

        self.save((err) => {
            if (err) {
                Logger.error('Could not save consumer to database: ' + err);
                throw err;
            } else {
                console.log('Consumer ' + self.name + ' is connected to ' + self.market +
                    '\n Time: ' + self.timestamp.toString() +
                    '\n Consuming: ' + self.consumption + ' Wh' +
                    '\n Bought energy: ' + self.bought + ' Wh' +
                    '\n Price per Wh is: ' + this.market.market.price + ' SEK' +
                    '\n Blackout: ' + this.blackout +
                    '\n Retrying: ' + this.retrying +
                    '\n Energy need: ' + this.demand
                )
            }
        });
    }
}

module.exports = ConsumerSim;
