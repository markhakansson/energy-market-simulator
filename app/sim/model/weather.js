var gauss = require('../../helper/gauss');
var Weather = require('../../db/model/weather');

class WeatherSim {
    constructor(name, wind_speed, temperature) {
        if (wind_speed < 1 || wind_speed > 40) {
            throw new Error("Illegal wind speed");
        }
        
        if (temperature < -100 || temperature > 100) {
            throw new Error("Illegal temperature");
        }
        
        this.weather = new Weather( {
            name: name,    
            timestamp: Date.now(),
            wind_speed: wind_speed,
            temperature: temperature
        });
        
        this.weather.save((err) => {
            if(err) throw err;
            console.log("Weather " + this.weather.name + " created and saved to db!");

        });


        // })
        // Weather.findOneAndUpdate( { name: name }, this.update, { new: true, upsert: true }, (err, weather) => {
        //     if(err) throw err;
        //     this.weather = weather;

        // });
       
    }

    update() {
        var arr;
        let self = this.weather;
        // Threshold of 20 m/s. If it reaches over that point the distribution will favor smaller wind speeds.
        if(self.wind_speed < 15) {
            arr = [0.5 * self.wind_speed, self.wind_speed, 1.5 * self.wind_speed];
        } else {
            arr = [0.8 * self.wind_speed, 0.9 * self.wind_speed, 0.95 * self.wind_speed, 1.1 * self.wind_speed];
        } 
        
        this.weather = new Weather( {
            name: self.name,    
            timestamp: Date.now(),
            wind_speed: gauss.gaussLimit(arr, 2, 0.1, 1, 40),
            temperature: self.temperature
        });

        this.weather.save((err) => {
            if(err) throw err;
            console.log("Weather " + self.name + " windspeed has been updated to " + self.wind_speed);
        });
        

    }

}

module.exports = WeatherSim;