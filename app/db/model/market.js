const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const market = new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now() },
    demand: Number,
    status: String,
    startUp: Boolean, // use to turn plant on and off
    price: Number, // real market value, can be set manually
    production: Number, // real production value, can be set manually
    consumption: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0
    },
    // used to toggle manual control. No autopilot => price and production is fixed.
    autopilot: {
        type: Boolean,
        default: true
    },
    recommendedPrice: Number, // sim value!
    recommendedProduction: Number, // sim value!
    plantInOperation: Boolean,
});

module.exports = mongoose.model('Market', market);
