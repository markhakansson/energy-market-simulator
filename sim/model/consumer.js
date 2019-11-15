

class Consumer {
    constructor(name, market) {
        this.name = name;
        this.market = market;
        this.consumption = this.calcConsumption();
    }

    get market() {
        return this.market;
    }

    get consumption() {
        return this.consumption;
    }

    calcConsumption() {
        this.consumption = 10; // should be gauss distribution
        updateTime();
    }


}

module.exports = Consumer;
