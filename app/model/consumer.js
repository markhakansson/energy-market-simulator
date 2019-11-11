const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumer = new Schema({
    name: String,
    timestamp: Number,
    consumption: Number

});

module.exports = mongoose.model('Consumer', consumer);