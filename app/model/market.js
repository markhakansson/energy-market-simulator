const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const market = new Schema({
    timestamp: Number,
    price: Number,
    battery: Number,
    consumption: Number,
    demand: Number

});

module.exports = mongoose.model('Market', market);