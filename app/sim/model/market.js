

class Market {
    constructor(name, price, maxBatteryCap) {
        this.name = name;
        this.price = price;
        this.consumption = 10 * 3000; // 10 times the household
        this.currBatteryCap = 0;
        this.demand = 0;
        this.customers = customers;
        this.maxBatteryCap = maxBatteryCap;
        this.demand = 0;
    }

   buy(demand) {
       this.demand += demand;
   }

   sell(demand) {
       this.demand -= demand;
   }

    generateProduction() {
        
    }

    generateConsumption() {
        let consumption = this.consumption / 1000;
        let arr;
 
         if(consumption < ( 4.0 * 10 )) {
             arr = [0.8 * consumption, consumption, 1.2 * consumption];
         } else {
             arr = [0.8 * consumption, 0.9 * consumption, 0.95 * consumption, 1.1 * consumption];
         }
 
         this.consumption = gauss.gauss(arr, 4, 0.1) * 1000;
    }

    setBattery() {
        
    }
}

module.exports = Market;