

class Market {
    constructor(name, price, maxBatteryCap) {
        this.startUp = true;
        this.name = name;
        this.price = price;
        this.consumption = 10 * 3000; // 10 times the household
        this.currBatteryCap = 0;
        this.maxBatteryCap = maxBatteryCap;
    }

   buy(demand) {
       let currBatt = this.currBatteryCap - demand;
        if ( currBatt > 0 ) {
            /**
             * if current battery is less than 2/3 of max battery capacity
             * increase price by 1/3
             */
            if ( currBatt < 2 * this.maxBatteryCap / 3 ) { 
                this.price += this.price / 3;
            }
            /**
             * if current battery is less than 1/3 of max battery capacity
             * increase price AGAIN by 1/2
             */
            if ( currBatt < this.maxBatteryCap / 3) {
                this.price += this.price / 2;
            }
            this.currBatteryCap -= demand;
            return demand;
        }

        return 0;
       
   }

   sell(demand) {
       let currBatt = this.currBatteryCap + demand;
       if ( currBatt <= this.maxBatteryCap ) {
              /**
             * if current battery is greater than 2/3 of max battery capacity
             * decrease price by 1/3
             */
            if ( currBatt > 2 * this.maxBatteryCap / 3 ) { 
                this.price -= this.price / 3;
            }
            /**
             * if current battery is less than 1/3 of max battery capacity
             * decrease price AGAIN by 1/2
             */
            if ( currBatt > this.maxBatteryCap / 3) {
                this.price -= this.price / 2;
            }
            this.currBatteryCap += demand;
        }
        return 0;
   }

   generateProduction() {
        if (this.startUp) {
            console.log("Market " + this.name + " is starting up...");
            setTimeout(function() {
                this.startUp = false;
                this.currBatteryCap += 3000;

            }, 30000);
             
        } else {
            this.currBatteryCap += 3000;
        }
       
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
            this.currBatteryCap -= this.consumption;
    }

    
}

module.exports = Market;