const gauss = require('../../helper/gauss');

class Prosumer {
    constructor(name, market, wind, time, batterySize) {
        this.name = name;
        this.market = market;
        this.wind = wind;
        this.production = this.setProduction(); // Wh
        this.consumption = this.setConsumption(); // Wh
        this.time = time;
        this.currBatteryCap = 0;
        this.maxBatteryCap = batterySize;
        this.fillBatteryRatio = 0.0;
        this.useBatteryRatio = 0.0;
    }

    setProduction() {
        this.production = 1000;
    }

    setConsumption() {
        this.consumption = 3000; // should be gauss distribution
        this.updateTime();
    }

    /**
     * Set how much of any excessive production should be used to fill the battery.
     * The rest will be sold to the market.
     * @param {*} ratio Ratio to set (percent). Can only be a value between [0.0, 1.0].
     */
    setFillBatteryRatio(ratio) {
        if(ratio > 1.0 || ratio < 0.0) {
            console.log("Warning! Ratio for filling the battery is wrong!");
        }   
        this.fillBatteryRatio = ratio;
    }

    /**
     * Set how much electricity should be used up from the battery when the household's demands are exceeding
     * their own production. 
     * @param {*} ratio Ratio to set (percent). Can only be a value between [0.0, 1.0].
     */
    setUseBatteryRatio(ratio) {
        if(ratio > 1.0 || ratio < 0.0) {
            console.log("Warning! Ratio for using the battery is wrong!");
        }   
        this.useBatteryRatio = ratio;
    }

    generateProduction(windSpeed) {
        this.production = windSpeed * 250;
        let prod_diff = this.production - this.consumption;

        // Check if there is an excessive production of power
        if(prod_diff > 0) {
            this.chargeBattery(this.fillBatteryRatio * prod_diff);
            this.sellToMarket((1 - this.fillBatteryRatio) * prod_diff);
        }
    }

    generateConsumption() {
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        let consumption = this.consumption / 1000;
        let arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller wind speeds.
        if(consumption < 4.0) {
            arr = [0.8 * consumption, consumption, 1.2 * consumption];
        } else {
            arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
        }

        this.consumption = gauss.gauss(arr, 4, 0.1) * 1000;   
        let cons_diff = this.consumption - this.production;

        // Check if household's demand exceeds production
        if(cons_diff > 0) {
            this.useBattery(this.useBatteryRatio * cons_diff);
            this.buyFromMarket((1 - this.useBatteryRatio) * cons_diff);
        } 

    }

    chargeBattery(energy) {
        if(this.currBatteryCap + energy >= this.maxBatteryCap) {
            this.currBatteryCap = this.maxBatteryCap;
            this.sellToMarket(this.currBatteryCap + energy - this.maxBatteryCap);
        } else {
            this.currBatteryCap += energy;
        }
    }

    useBattery(energy) {
        if(this.currBatteryCap - energy < 0) {
            let buyEnergy = energy - this.currBatteryCap;
            this.buyFromMarket(buyEnergy);
            this.currBatteryCap = 0;
        } else {
            this.currBatteryCap -= energy;
        }
    }

    updateTime() {
        this.time = Date.now();
    }

    buyFromMarket(energy) {
        let boughtEnergy = this.market.buy(energy); 
        
        if(boughEnergy < energy) {
            this.consumption -= (energy - boughtEnergy);
        }
    }

    sellToMarket(energy) {
        this.market.sell(energy);
    }

    display() {
        console.log(this.name + " is connected to " + this.market +
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