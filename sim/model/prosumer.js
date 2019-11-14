

class Prosumer {
    constructor(name, market, consumption, battery) {
        this.name = name;
        this.market = market;
        this.consumption = consumption;
        this.battery = battery;
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

    calcBattery() {

    }
}

module.exports = mongoose.model('Prosumer', prosumer);