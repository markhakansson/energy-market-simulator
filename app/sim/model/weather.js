var gauss = require('../../helper/gauss');
const mongoose = require('mongoose');


class Weather extends mongoose.Schema {
    constructor(name, wind_speed, temperature) {
        // new Weather({
        //     name: name,
        //     timestamp: Date.now(),
        //     wind_speed: this.generateWind(),
        //     temperature: this.temperature(),
        
        // });
        this.wind_speed = wind_speed;
        this.temperature = temperature;
        weather.save(function(err){
            if (err) throw err;
            console.log("Weather saved to db!")
        })
    }

    setWeather(wind_speed) {
        this.wind_speed = wind_speed;
    }

    generateWind() {
        var arr;
        // Threshold of 20 m/s. If it reaches over that point the distribution will favor smaller wind speeds.
        if(this.wind_speed < 15) {
            arr = [0.5 * this.wind_speed, this.wind_speed, 1.5 * this.wind_speed];
        } else {
            arr = [0.8 * this.wind_speed, 0.9 * this.wind_speed, 0.95 * this.wind_speed, 1.1 * this.wind_speed];
        }
        this.wind_speed = gauss.gaussLimit(arr, 2, 0.1, 1, 40);        
    }

    getWindSpeed() {
        return this.wind_speed;
    }

}

module.exports = Weather;