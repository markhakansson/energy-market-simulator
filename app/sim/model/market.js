const gauss = require('../../helper/gauss');
const Market = require('../../db/model/market');

const Logger = require('../../config/logger');

class MarketSim {
    constructor (name, timeMultiplier) {
        this.market = { name };
        this.timeMultiplier = timeMultiplier;
    }

    /**
     * Gets the current data for this model in the database.
     */
    async fetchData () {
        const self = this;
        await Market.findOne({ name: self.market.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) {
                Logger.error('Matching market with name [' + self.market.name + '] was not found in the database!');
                throw new Error('Matching market with name [' + self.market.name + '] was not found in the databse.');
            } else {
                self.market = doc;
            }
        })
    }

    buy (demand) {
        const self = this.market;

        if (demand < 0 || demand == null) {
            Logger.warn(
                'In market [' + self.name + '] when receiving a buy order, expected postive Number. Recieved: ' +
                demand + '.'
            );
        }

        self.demand += demand;
        const currBatt = self.currBatteryCap - demand;
        if (currBatt > 0 && !self.startUp) {
            /**
             * if current battery is less than 2/3 of max battery capacity
             * increase price by 1/3
             */
            if (currBatt < 2 * self.maxBatteryCap / 3) {
                self.price += self.price / 3;
            }
            /**
             * if current battery is less than 1/3 of max battery capacity
             * increase price AGAIN by 1/2
             */
            if (currBatt < self.maxBatteryCap / 3) {
                self.price += self.price / 2;
            }
            self.currBatteryCap -= demand;
            return demand;
        }

        return 0;
    }

    sell (demand) {
        const self = this.market;

        if (demand < 0 || demand == null) {
            Logger.warn(
                'In market [' + self.name + '] when receiving a sell order, expected postive Number. Recieved: ' +
                demand + '.'
            );
        }

        self.demand -= demand;
        const currBatt = self.currBatteryCap + demand;
        if (currBatt <= self.maxBatteryCap) {
            /**
             * if current battery is greater than 2/3 of max battery capacity
             * decrease price by 1/3
             */
            if (currBatt > 2 * self.maxBatteryCap / 3) {
                self.price -= self.price / 3;
            }
            /**
             * if current battery is less than 1/3 of max battery capacity
             * decrease price AGAIN by 1/2
             */
            if (currBatt > self.maxBatteryCap / 3) {
                self.price -= self.price / 2;
            }
            self.currBatteryCap += demand;
        }
        return 0;
    }

    generateProduction () {
        const self = this.market;
        if (self.startUp) {
            self.status = 'starting up...';
            setTimeout(() => {
                self.startUp = false;
            }, 10000);
        } else {
            self.status = 'running!';
            if ((self.currBatteryCap += self.production) < self.maxBatteryCap) {
                self.currBatteryCap += self.production;
            }
        }

        if (self.currBatteryCap < 0) {
            self.status = 'BLACK OUT!!!!!';
            self.startUp = true;
        }
    }

    update () {
        let self = this.market;

        self = new Market({
            name: self.name,
            timestamp: Date.now(),
            demand: self.demand,
            status: self.status,
            startUp: self.startUp,
            price: self.price,
            production: self.production,
            consumption: self.production / 10,
            currBatteryCap: self.currBatteryCap,
            maxBatteryCap: self.maxBatteryCap
        });

        self.save((err) => {
            if (err) {
                Logger.error('Could not save market to database: ' + err);
                throw err;
            } else {
                console.log('Market ' + self.name +
                    '\n current demand: ' + self.demand +
                    '\n status: ' + self.status +
                    '\n startup: ' + self.startUp +
                    '\n Time: ' + self.timestamp.toString() +
                    '\n Producing: ' + self.production + ' Wh' +
                    '\n Consuming: ' + self.consumption + ' Wh' +
                    '\n Price per Wh is: ' + self.price + ' SEK' +
                    '\n CurrentBatteryCap: ' + self.currBatteryCap + ' Wh' +
                    '\n MaxBatteryCap: ' + self.maxBatteryCap + ' Wh'
                )
            }
        });
    }
}

module.exports = MarketSim;
