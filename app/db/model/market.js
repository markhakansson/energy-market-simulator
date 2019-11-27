const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const market = new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now() },
    status: String,
    startUp: Boolean,
    price: Number,
    production: Number,
    consumption: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number

});

module.exports = mongoose.model('Market', market);