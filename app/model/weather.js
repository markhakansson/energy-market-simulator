const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weather = new Schema({
    name: String,
    timestamp: Number,
    wind_speed: Number,
    wind_direction: String,
    description: String

});

module.exports = mongoose.model('Weather', weather);