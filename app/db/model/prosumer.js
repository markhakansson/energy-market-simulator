const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prosumer = new Schema({
    name: String,
    wind: Number,
    market: Object,
    timeMultiplier: Number,
    timestamp: { type: Date, default: new Date() },
    production: Number,
    consumption: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: Number,
    useBatteryRatio: Number,
    bought: Number,
    blackout: Boolean,
    turbineStatus: String,
    turbineWorking: Boolean,
    turbineBreakPercent: Number,


});

module.exports = mongoose.model('Prosumer', prosumer);