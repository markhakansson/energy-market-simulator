

class Weather {
    constructor() {
        this.wind_speed = 0;
        this.wind_direction = "";
        this.description = "";
    }

    setWeather(wind_speed, wind_direction, description) {
        this.wind_speed = wind_speed;
        this.wind_direction = wind_direction;
        this.description = description;
    }

    getWindSpeed() {
        return this.wind_speed;
    }

    getWindDir() {
        return this.wind_direction;
    }

    getDescription() {
        return this.description;
    }

}

module.exports = Weather;