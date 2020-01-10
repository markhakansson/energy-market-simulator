const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumer = new Schema({
    name: { type: String, required: true },
    market: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    consumption: {
        type: Number,
        default: 0.0,
        min: 0.0
    },
    bought: {
        type: Number,
        default: 0.0,
        min: 0.0
    },
    blackout: { type: Boolean, default: false },
    demand: { type: Number, default: 0.0 }
});

module.exports = mongoose.model('Consumer', consumer);
