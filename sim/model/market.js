

class Market {
    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.consumption = this.calcConsumption();
        this.battery = 0;
        this.demand = 0;
    }

    set demand(demand) {
        this.demand = demand;
    }

    set price(price) {
        this.price = price;
    }

    get price() {
        return this.price;
    }

    calcConsumption() {
        this.consumption = 10; // should be gauss distribution
        updateTime();
    }

    calcBattery() {
        
    }
}

module.exports = Market;