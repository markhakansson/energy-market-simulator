const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
this.name = name;
        this.market = market;
        this.wind = wind;
        this.timeMultiplier = 5;
        this.production = 1000; // Wh
        this.consumption = 3000; // Wh
        this.currBatteryCap = 0;
        this.maxBatteryCap = batterySize;
        this.fillBatteryRatio = fillBattRatio;
        this.useBatteryRatio = useBattRatio;
        this.bought = 0;
        this.blackout = false;
        this.turbineStatus = "WORKING!";
        this.turbineBreakagePercent = 0.05;
        this.turbineWorking = true;

 */
const prosumer = new Schema({
    name: String,
    wind: Number,
    market: String,
    timeMultiplier: Number,
    timestamp: { type: Date, default: Date.now() },
    production: Number,
    consumption: Number,
    currBatteryCap: Number,
    maxBatteryCap: Number,
    fillBatteryRatio: Number,
    useBatteryRatio: Number,
    bought: Number,
    blackout: Boolean,
    turbineStatus: String,
    turbineWorking: Boolean,
    turbineBreakPercent: Number,


});

module.exports = mongoose.model('Prosumer', prosumer);