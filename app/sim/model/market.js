const gauss = require('../../helper/gauss');


class Market {
    constructor(name, price, production, maxBatteryCap) {
        this.name = name;
        this.status = "";
        this.startUp = true;
        this.price = price;
        this.production = production;
        this.consumption = production / 10;
        this.currBatteryCap = 0;
        this.maxBatteryCap = maxBatteryCap;
    }

   buy(demand) {
       let currBatt = this.currBatteryCap - demand;
        if ( currBatt > 0  && !this.startUp) {
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
            this.status = "starting up...";
            setTimeout(() => {
                this.startUp = false;
            }, 10000);

        } else {
            this.status = "running!";
            if ( ( this.currBatteryCap += this.production ) < this.maxBatteryCap) {
                this.currBatteryCap += this.production;
            }
        
        }

        if ( this.currBatteryCap <= 0 ) {
            console.log("Market BLACK OUT!!!!!")
            this.startUp = true;
        } 
       
   }

    display() {
        console.log("Market is " + this.status +
            "\n Time: " + Date(this.time).toString() + 
            "\n Producing: " + this.production + " Wh" +
            "\n Consuming: " + this.consumption + " Wh" +
            "\n Price per Wh is: " + this.price + " SEK" +
            "\n CurrentBatteryCap: " + this.currBatteryCap + " Wh" +
            "\n MaxBatteryCap: " + this.maxBatteryCap + " Wh"
        );
    }

    
}



module.exports = Market;