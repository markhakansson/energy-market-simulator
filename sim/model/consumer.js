

class Consumer {
    constructor(name, market, consumption, time) {
        this.name = name;
        this.market = market;
        this.consumption = consumption;
        this.time = time;
    }

    get market() {
        return this.market;
    }

    get consumption() {
        return this.consumption;
    }

    set consumption(consumption) {
        this.consumption = consumption;
    }

    set time(time) {
        this.time = time;
    }

    calcConsumption() {

    }


}


module.exports = mongoose.model('Consumer', consumer);
