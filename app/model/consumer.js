const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumer = new Schema({
    timestamp: Number,
    consumption: Number

});

module.exports = mongoose.model('Consumer', consumer);