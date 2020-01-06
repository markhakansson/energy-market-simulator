var gauss = require('../../helper/gauss');
var Weather = require('../../db/model/weather');

const Logger = require('../../config/logger');

class WeatherSim {
    /**
     * @param {*} name The name of the location this weather belongs to (market name).
     * @param {*} wind_speed Initial wind speed.
     * @param {*} temperature Initial temperature.
     */
    constructor (name, wind_speed, temperature) {
        if (name == null || name === '' || wind_speed == null || temperature == null) {
            throw new Error('Constructor arguments must be defined!');
        }

        if (wind_speed < 1 || wind_speed > 40) {
            throw new Error('Illegal wind speed');
        }

        if (temperature < -100 || temperature > 100) {
            throw new Error('Illegal temperature');
        }

        this.weather = new Weather({
            name: name,
            timestamp: Date.now(),
            wind_speed: wind_speed,
            temperature: temperature
        });
    }

    /**
     * Gets the current data for this model in the database. If no data is found,
     * it tries to create a new entry instead.
     */
    async fetchData () {
        const self = this;
        await Weather.findOne({ name: self.weather.name }, null, { sort: { timestamp: -1 } }, function (err, doc) {
            if (err) {
                Logger.warn('Matching weather with name [' + self.weather.name + '] was not found in the database');
                self.weather.save().catch((err) => {
                    throw err;
                });
                // throw new Error('Matching weather with name [' + self.weather.name + '] was not found in the database');
            } else {
                self.market = doc;
            }
        });
    }

    /**
     * Generates a new wind speed, then saves this model to the database.
     */
    update () {
        var arr;
        const self = this.weather;
        // Threshold of 20 m/s. If it reaches over that point the distribution will favor smaller wind speeds.
        if (self.wind_speed < 15) {
            arr = [0.5 * self.wind_speed, self.wind_speed, 1.5 * self.wind_speed];
        } else {
            arr = [0.8 * self.wind_speed, 0.9 * self.wind_speed, 0.95 * self.wind_speed, 1.1 * self.wind_speed];
        }

        this.weather = new Weather({
            name: self.name,
            timestamp: Date.now(),
            wind_speed: gauss.gaussLimit(arr, 2, 0.1, 1, 40),
            temperature: self.temperature
        });

        this.weather.save((err) => {
            if (err) throw err;
        });
    }
}

module.exports = WeatherSim;
