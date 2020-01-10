const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const market = new Schema({
    name: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    demand: { type: Number, default: 0 },
    status: { type: String, default: 'stopped' },
    startUp: { type: Boolean, default: true }, // use to turn plant on and off
    price: { // real market value, can be set manually
        type: Number,
        default: 0.0,
        min: 0.0
    },
    production: { // real production value, can be set manually
        type: Number,
        default: 0.0,
        min: 0.0
    },
    consumption: {
        type: Number,
        default: 0.0,
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
    // used to toggle manual control. No autopilot => price and production is fixed.
    autopilot: { type: Boolean, default: true },
    recommendedPrice: { // sim value!
        type: Number,
        default: 0.0,
        min: 0.0
    },
    recommendedProduction: { // sim value!
        type: Number,
        default: 0.0,
        min: 0.0
    },
    plantInOperation: { type: Boolean, default: true },
    manualProduction: { // use to set production manually
        type: Number,
        default: 0.0,
        min: 0.0
    },
    manualPrice: { // use to set price manually
        type: Number,
        default: 0.0,
        min: 0.0
    }
});

module.exports = mongoose.model('Market', market);
