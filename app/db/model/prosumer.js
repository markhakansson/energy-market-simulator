const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prosumer = new Schema({
    name: String,
    market: String,
    timestamp: {
        type: Date,
        default: new Date()
    },
    consumption: Number,
    production: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0
    },
    useBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0
    },
    bought: Number,
    blackout: Boolean,
    turbineStatus: String,
    turbineWorking: Boolean,
    turbineBreakPercent: {
        type: Number,
        min: 0.0,
        max: 1.0
    },
    blocked: Boolean,
    blockedTimer: {
        type: Number,
        default: 0.0,
        min: 0.0,
        max: 100
    }
});

module.exports = mongoose.model('Prosumer', prosumer);
