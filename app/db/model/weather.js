const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weather = new Schema({
    name: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    wind_speed: {
        type: Number,
        default: 4.0,
        min: 0.0
    },
    temperature: { type: Number, default: 20.0 },
    market: { type: String, required: true }
});

module.exports = mongoose.model('Weather', weather);
