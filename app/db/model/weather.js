const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weather = new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now() },
    wind_speed: Number,
    temperature:Number
});

module.exports = mongoose.model('Weather', weather);