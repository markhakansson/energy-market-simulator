const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prosumer = new Schema({
    name: { type: String, required: true },
    market: { type: String, required: true },
    timestamp: { type: Date, default: new Date() },
    consumption: {
        type: Number,
        default: 0.0,
        min: 0.0
    },
    production: {
        type: Number,
        default: 0,
        min: 0.0
    },
    currBatteryCap: {
        type: Number,
        default: 0.0,
        min: 0.0
    },
    maxBatteryCap: {
        type: Number,
        default: 10000,
        min: 0.0
    },
    fillBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0
    },
    useBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0
    },
    bought: {
        type: Number,
        default: 0.0,
        min: 0.0
    },
    blackout: { type: Boolean, default: false },
    turbineStatus: { type: String, default: 'WORKING' },
    turbineWorking: { type: Boolean, default: true },
    turbineBreakPercent: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.05
    },
    blocked: { type: Boolean, default: false },
    blockedTimer: {
        type: Number,
        min: 0.0,
        max: 100,
        default: 0.0
    }
});

module.exports = mongoose.model('Prosumer', prosumer);
