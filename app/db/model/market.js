const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const market = new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now() },
    demand: Number,
    status: String,
    startUp: Boolean,
    price: Number,
    production: Number,
    consumption: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0
    },
    // Used for manual control of market
    autopilot: {
        type: Boolean,
        default: true
    },
    recommendedPrice: Number,
    recommendedProduction: Number
});

module.exports = mongoose.model('Market', market);
