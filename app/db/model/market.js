const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
this.startUp = true;
this.name = name;
this.price = price;
this.consumption = 10 * 3000; // 10 times the household
this.currBatteryCap = 0;
this.maxBatteryCap = maxBatteryCap;
 */
const market = new Schema({
    name: { type: String, unique: true },
    timestamp: { type: Date, default: Date.now() },
    price: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    consumption: Number

});

module.exports = mongoose.model('Market', market);