var gauss = require('../../helper/gauss')
var tools = require('../../helper/tools');
var Consumer = require('../../db/model/consumer');

class ConsumerSim {
    constructor (name, market, timeMultiplier) {
        this.consumer = { name: name };

        this.market = market;
        this.timeMultiplier = timeMultiplier;
    }

    /**
     * Gets the latest version of this model from the database.
     */
    async fetchData () {
        const self = this;
        await Consumer.findOne({ name: this.consumer.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) {
                throw err;
            } else {
                self.consumer = doc;
            }
        });
    }

    setConsumption (consumption) {
        const self = this.consumer;
        self.consumption = consumption; // should be gauss distribution
    }

    generateConsumption () {
        const self = this.consumer;
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        let consumption = self.consumption / 1000;
        let arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller consumptions.
        if (consumption > 0) {
            if (consumption < 4.0) {
                arr = [0.8 * consumption, consumption, 1.2 * consumption];
            } else {
                arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
            }

            consumption = gauss.gauss(arr, 4, 0.05) * 1000;
            this.buyFromMarket(consumption);

        // If blackout has occured, try to buy from market in the future
        } else if (self.blackout && !self.retrying) {
            self.retrying = true;

            tools.sleep(2 * this.timeMultiplier).then(() => {
                arr = [0.8 * 3, 3, 1.2 * 3];
                consumption = gauss.gauss(arr, 4, 0.05) * 1000;
                this.buyFromMarket(consumption);
                self.retrying = self.blackout;
            });
        }
    }

    buyFromMarket (energy) {
        const self = this.consumer;
        const boughtEnergy = this.market.buy(energy);
        self.bought = boughtEnergy;

        if (boughtEnergy === 0) {
            self.consumption = 0;
            self.blackout = true;
        } else if (boughtEnergy < energy) {
            self.consumption -= (energy - boughtEnergy);
            self.blackout = false;
        } else {
            self.consumption = energy;
            self.blackout = false;
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
            blackout: self.blackout,
            retrying: self.retrying
        });

        self.save((err) => {
            if (err) throw err;
            console.log('Consumer ' + self.name + ' is connected to ' + self.market +
                '\n Time: ' + self.timestamp.toString() +
                '\n Consuming: ' + self.consumption + ' Wh' +
                '\n Bought energy: ' + self.bought + ' Wh' +
                '\n Price per Wh is: ' + this.market.price + ' SEK' +
                '\n Blackout: ' + self.blackout +
                '\n Retrying: ' + self.retrying
            )
        });
    }
}

module.exports = ConsumerSim;
