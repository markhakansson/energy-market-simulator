

class Consumer {
    constructor(name, market, time) {
        this.name = name;
        this.market = market;
        this.time = time;
        this.consumption = 0;
    }

    setConsumption() {
        this.consumption = 10; // should be gauss distribution
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
