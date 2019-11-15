

class Prosumer {
    constructor(name, market, wind, time) {
        this.name = name;
        this.market = market;
        this.wind = wind;
        this.production = this.setProduction();
        this.consumption = this.setConsumption();
        this.time = time;
        this.battery = 0;
        this.sell = 0;
        this. buy = 0;
    }

    setProduction() {
        this.production = 100 / 10;
    }

    setConsumption() {
        this.consumption = 10; // should be gauss distribution
        this.updateTime();
    }

    updateTime() {
        this.time = Date.now();
    }

    setBattery() {
        // if(battery >= 100) {
        //     this.sell = this.battery - 100;
        // }
    }

    display() {
        console.log(this.name + " connected to " + this.market.name + 
        "\n Time: " + Date(this.time).toString() + 
        "\n Producing: " + this.production + " kW/h" +
        "\n Consuming: " + this.consumption + " kW/h" +
        "\n Battery: " + this.battery + " kW/h" + 
        "\n Buying: " + this.buy + " kW/h" +
        "\n Selling: " + this.sell + "kw/h"
        );
    }
}

module.exports = Prosumer;