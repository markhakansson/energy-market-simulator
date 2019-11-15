

class Weather {
    constructor() {
        this.wind_speed = 0;
        
    }

    setWeather(wind_speed) {
        this.wind_speed = wind_speed;
    }

    getWindSpeed() {
        return this.wind_speed;
    }

}

module.exports = Weather;