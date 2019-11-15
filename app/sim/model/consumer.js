

class Consumer {
    constructor(name, market) {
        this.name = name;
        this.market = market;
        this.consumption = this.calcConsumption();
    }

    set market(market) {
        this._market = market;
    }

    get market() {
        return this._market;
    }

    get consumption() {
        return this._consumption;
    }

    calcConsumption() {
        this.consumption = 10; // should be gauss distribution
    }

}

module.exports = Consumer;
