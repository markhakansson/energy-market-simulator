var gauss = require('../../helper/gauss')
const Consumer = require('./model/consumer');

class Consumer {
    constructor(name, market, time) {
        this.name = name;
        this.market = market;
        this.time = time;
        this.consumption = 3000; // in Wh
        this.bought;
    }

    setConsumption(consumption) {
        this.consumption = consumption; // should be gauss distribution
    }

    generateConsumption() {
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        let consumption = this.consumption / 1000;
        let arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller wind speeds.
        if(consumption > 0) {
            if(consumption < 4.0) {
                arr = [0.8 * consumption, consumption, 1.2 * consumption];
            } else {
                arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
            }
            consumption = gauss.gauss(arr, 4, 0.05) * 1000;   
            this.buyFromMarket(consumption);
        }
    }

    buyFromMarket(energy) {
        let boughtEnergy = this.market.buy(energy); 
        this.bought = boughtEnergy;
        if(boughtEnergy == 0) {
            this.consumption = 0;
            console.log("BLACK OUT! at time: " + Date(this.time.toString()));
        } else if(boughtEnergy < energy) {
            this.consumption -= (energy - boughtEnergy);
        } else {
            this.consumption = energy;
        }
    }

    display() {
        console.log("Consumer " + this.name + " is connected to " + this.market.name + 
        "\n Time: " + Date(this.time).toString() + 
        "\n Consuming: " + this.consumption + " Wh" + 
        "\n Bought energy: " + this.bought + " Wh" +
        "\n Price per Wh is: " + this.market.price +" SEK"
        );

    }
    

}

module.exports = Consumer;
