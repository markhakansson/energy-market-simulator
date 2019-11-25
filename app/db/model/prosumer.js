const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
this.name = name;
this.market = market;
this.wind = wind;
this.production = this.setProduction(); // Wh
this.consumption = this.setConsumption(); // Wh
this.time = time;
this.currBatteryCap = 0;
this.maxBatteryCap = batterySize;
this.fillBatteryRatio = this.setFillBatteryRatio(fillBattRatio);
this.useBatteryRatio = this.setUseBatteryRatio(useBattRatio);

 */
const prosumer = new Schema({
    name: { type: String, unique: true },
    wind: Number,
    market: String,
    timestamp: { type: Date, default: Date.now() },
    production: Number,
    consumption: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: Number,
    useBatteryRatio: Number

});

module.exports = mongoose.model('Prosumer', prosumer);