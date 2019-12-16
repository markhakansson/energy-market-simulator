const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prosumer = new Schema({
    name: String,
    market: String,
    timestamp: { type: Date, default: new Date() },
    consumption: Number,
    production: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: Number,
    useBatteryRatio: Number,
    bought: Number,
    blackout: Boolean,
    turbineStatus: String,
    turbineWorking: Boolean,
    turbineBreakPercent: Number

});

module.exports = mongoose.model('Prosumer', prosumer);
