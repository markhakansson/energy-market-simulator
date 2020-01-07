const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const market = new Schema({
    name: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    demand: { type: Number, default: 0 },
    status: { type: String, default: 'stopped' },
    startUp: { type: Boolean, default: true }, // use to turn plant on and off
    price: { type: Number, default: 0 }, // real market value, can be set manually
    production: { type: Number, default: 0 }, // real production value, can be set manually
    consumption: { type: Number, default: 0 },
    currBatteryCap: { type: Number, default: 0 },
    maxBatteryCap: { type: Number, default: 10000 },
    fillBatteryRatio: {
        type: Number,
        min: 0.0,
        max: 1.0,
        default: 0.0
    },
    // used to toggle manual control. No autopilot => price and production is fixed.
    autopilot: { type: Boolean, default: true },
    recommendedPrice: { type: Number, default: 0 }, // sim value!
    recommendedProduction: { type: Number, default: 0 }, // sim value!
    plantInOperation: { type: Boolean, default: true },
    manualProduction: { type: Number, default: 0 }, // use to set production manually
    manualPrice: { type: Number, default: 0 } // use to set price manually
});

module.exports = mongoose.model('Market', market);
