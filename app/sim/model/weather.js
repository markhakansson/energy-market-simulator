var gauss = require('../../helper/gauss');
var Weather = require('../../db/model/weather');

class WeatherSim {
    constructor(name, wind_speed, temperature) {
        this.name = name;
        this.wind_speed = wind_speed;
        this.temperature = temperature;
        
        this.weather = new Weather({
            name: name,
            timestamp: Date.now(),
            wind_speed: wind_speed,
            temperature: temperature
        
        });

        this.weather.save(function(err){
            if (err) throw err;
            console.log("Weather " + name + " created and saved to db!");
        });
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
        this.weather.wind_speed = this.wind_speed;
        this.weather.save((err) => {
            if(err) throw err;
            console.log("Weather " + this.name + " windspeed has been updated to " + this.wind_speed);
        });
        

    }

}

module.exports = WeatherSim;