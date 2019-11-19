var gauss = require('../../helper/gauss')

class Weather {
    constructor() {
        this.wind_speed = 10;
        this.temperature = 20;
    }

    setWeather(wind_speed) {
        this.wind_speed = wind_speed;
    }

    generateWind() {
        var arr;
        // Threshold of 20 m/s. If it reaches over that point the distribution will favor smaller wind speeds.
        if(this.wind_speed < 20) {
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