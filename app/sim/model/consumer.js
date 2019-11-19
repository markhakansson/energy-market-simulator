var gauss = require('../../helper/gauss')

class Consumer {
    constructor(name, market, time) {
        this.name = name;
        this.market = market;
        this.time = time;
        this.consumption = 3000; // in Wh
    }

    setConsumption(consumption) {
        this.consumption = consumption; // should be gauss distribution
    }

    generateConsumption() {
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        var consumption = this.consumption / 1000;
        var arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller wind speeds.
        if(consumption < 4.0) {
            arr = [0.8 * consumption, consumption, 1.2 * consumption];
        } else {
            arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
        }

        this.consumption = gauss.gauss(arr, 4, 0.1) * 1000;   
        
    }

    getConsumption() {
        return this.consumption;
    }

    updateTime(time) {
        this._time = time;
    }

    display() {
        console.log("Consumer " + this.name + " is connected to " + this.market.name + 
        "\n Time: " + Date(this.time).toString() + 
        "\n Consuming: " + this.consumption + " kW/h"
        );

    }
    

}

module.exports = Consumer;
