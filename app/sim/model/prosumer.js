const gauss = require('../../helper/gauss');
var tools = require('../../helper/tools');
var Prosumer = require('../../db/model/prosumer');


class ProsumerSim {
    constructor(name, market, wind, fillBattRatio, useBattRatio, batterySize) {
    
        this.prosumer = new Prosumer( {
            name: name,
            wind: wind,
            market: market,
            timeMultiplier: 5,
            timestamp: Date.now(),
            production: 1000,
            consumption: 3000,
            currBatteryCap: 0,
            maxBatteryCap: batterySize,
            fillBatteryRatio: fillBattRatio,
            useBatteryRatio: useBattRatio,
            bought: 0,
            blackout: false,
            turbineStatus: "WORKING!",
            turbineWorking: true,
            turbineBreakPercent: 0.05,

        });

        this.prosumer.save((err) => {
            if(err) throw err;
            console.log("Prosumer " + this.prosumer.name + " created and saved to db!");

        });
    }
    randomizeTurbineBreaking() {
        let self = this.prosumer;
        if(self.turbineWorking) {
            let rand = Math.random();

            if(rand < self.turbineBreakagePercent) {
                self.production = 0;
                self.turbineWorking = false;
                self.turbineStatus = "BROKEN! REPAIRMAN CALLED!";
                this.callTurbineRepairman();
            }
        }

        return self.turbineWorking;
    }

    generateProduction(windSpeed) {    
        let self = this.prosumer;
        if(this.randomizeTurbineBreaking()) {
            self.wind = windSpeed;
            self.production = windSpeed * 250;
            let prodDiff = self.production - self.consumption;

            // Check if there is an excessive production of power
            if(prodDiff > 0) {
                this.chargeBattery(self.fillBatteryRatio * prodDiff);
                this.sellToMarket((1 - self.fillBatteryRatio) * prodDiff);
            }
    
        } 
    }

    generateConsumption() {
        let self = this.prosumer;
        // Yearly consumption 25,000 kWh around 70 kWh a day/ 3 kWh an hour
        let consumption = self.consumption / 100;
        let arr;

        // Threshold of 4 kWh. If it reaches over that point the distribution will favor smaller wind speeds.
        if(consumption > 0) {
            if(consumption < 40) {
                arr = [0.8 * consumption, consumption, 1.2 * consumption];
            } else {
                arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
            }

            self.consumption = gauss.gaussLimit(arr, 4, 0.05, 0, 60) * 100;   
            let cons_diff = self.consumption - self.production;

            // Check if household's demand exceeds production
            if(cons_diff > 0) {
                this.useBattery(self.useBatteryRatio * cons_diff);
                this.buyFromMarket((1 - self.useBatteryRatio) * cons_diff);
            } 
        }
    }

    callTurbineRepairman() {
        let self = this.prosumer;
        tools.sleep(2 * self.timeMultiplier * 1000).then(() => {
            self.turbineStatus = "REPAIRMAN ON THE WAY...";
        });
        tools.sleep(this.timeMultiplier * 1000).then(() => {
            self.turbineStatus = "REPAIRING...";
        });
        tools.sleep(2 * this.timeMultiplier * 1000).then(() => {
            self.turbineWorking = true;
            self.turbineStatus = "WORKING!";
        });
    }

    chargeBattery(energy) {
        let self = this.prosumer;
        if(self.currBatteryCap + energy >= self.maxBatteryCap) {
            self.currBatteryCap = self.maxBatteryCap;
            this.sellToMarket(self.currBatteryCap + energy - self.maxBatteryCap);
        } else {
            self.currBatteryCap += energy;
        }
    }

    useBattery(energy) {
        let self = this.prosumer;
        if(self.currBatteryCap - energy < 0) {
            let buyEnergy = energy - self.currBatteryCap;
            this.buyFromMarket(buyEnergy);
            self.currBatteryCap = 0;
        } else {
            self.currBatteryCap -= energy;
        }
    }

    buyFromMarket(energy) {
        let self = this.prosumer;
        let boughtEnergy = self.market.buy(energy); 
        self.bought = boughtEnergy;
        if(boughtEnergy < energy) {
            self.consumption -= (energy - boughtEnergy);
        }
    }

    sellToMarket(energy) {
        let self = this.prosumer;
        self.market.sell(energy);
    }

    update() {
        let self = this.prosumer;

        self = new Prosumer( {
            name: self.name,
            wind: self.wind,
            market: self.market,
            timeMultiplier: self.timeMultiplier,
            timestamp: Date.now(),
            production: self.production,
            consumption: self.consumption,
            currBatteryCap: self.currBatteryCap,
            maxBatteryCap: self.batterySize,
            fillBatteryRatio: self.fillBatteryRatio,
            useBatteryRatio: self.useBatteryRatio,
            bought: self.bought,
            blackout: self.blackout,
            turbineStatus: self.turbineStatus,
            turbineWorking: self.turbineWorking,
            turbineBreakPercent: self.turbineBreakagePercent,
        });

        self.save((err) => {
            if(err) throw err;
            console.log(self.name + " is connected to " + self.market.market.name +
            "\n Time: " + self.timestamp.toString() + 
            "\n Wind: " + self.wind + " m/s" +
            "\n Producing: " + self.production + " Wh" +
            "\n Consuming: " + self.consumption + " Wh" +
            "\n Bought energy: " + self.bought + " Wh" +
            "\n Price per Wh is: " + self.market.market.price + " SEK" +
            "\n Battery: " + self.currBatteryCap + " Wh" +
            "\n Blackout: " + self.blackout + 
            "\n Turbine status: " + self.turbineStatus 
        )});
    }
}

module.exports = ProsumerSim;