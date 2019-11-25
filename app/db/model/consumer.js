const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *  this.name = name;
    this.market = market;
    this.time = time;
    this.consumption = 3000; 
 */
const consumer = new Schema({
    name: { type: String, unique: true },
    market: String,
    timestamp: { type: Date, default: Date.now() },
    consumption: Number

});

module.exports = mongoose.model('Consumer', consumer);