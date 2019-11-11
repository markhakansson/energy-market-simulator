const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prosumer = new Schema({
    name: String,
    timestamp: Number,
    consumption: Number,
    battery: Number,
    sell_market: Number,
    buy_market: Number

});

module.exports = mongoose.model('Prosumer', prosumer);