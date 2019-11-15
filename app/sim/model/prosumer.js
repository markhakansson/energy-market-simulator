

class Prosumer {
    constructor(name, market, wind) {
        this.name = name;
        this.market = market;
        this.wind = wind;
        this.consumption = this.calcConsumption();
        this.battery = 0;
        this.sell = 0;
        this. buy = 0;
    }

    get market() {
        return this.market;
    }

    get consumption() {
        return this.consumption;
    }

    get sell_market() {
        return this.sell;
    }

    get buy_market() {
        return this.buy;
    }

    get battery() {
        return this.battery;
    }

    calcConsumption() {
        this.consumption = 10; // should be gauss distribution
        updateTime();
    }

    calcBattery() {

    }
}

module.exports = Prosumer;