const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumer = new Schema({
    name: String,
    market: Object,
    timestamp: { type: Date, default: Date.now() },
    consumption: Number,
    bought: Number,
    timeMultiplier: Number,
    blackout: Boolean,
    retrying: Boolean

});

module.exports = mongoose.model('Consumer', consumer);
