

class Market {
    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.consumption = this.setConsumption();
        this.battery = 0;
        this.demand = 0;
    }


    setConsumption() {
        this.consumption = 10; // should be gauss distribution
    }

    setBattery() {
        
    }
}

module.exports = Market;