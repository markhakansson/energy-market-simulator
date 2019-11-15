

class Weather {
    constructor() {
        this.wind_speed = 0;
        this.wind_direction = "";
        this.description = "";
    }

    set wind_speed(wind_speed) {
        this.wind_speed = wind_speed;
    }

    set wind_direction(wind_dir) {
        this.wind_direction = wind_dir;
    }

    set description(desc) {
        this.description = desc;
    }

    calcWeather() {
        this.wind_speed = 5;
        this.wind_direction = "SW";
        this.description = "chilly breeze";
    }

}

module.exports = Weather;