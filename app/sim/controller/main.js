const ConsumerSim = require('../model/consumer');
const MarketSim = require('../model/market');
const ProsumerSim = require('../model/prosumer');
const WeatherSim = require('../model/weather');

const Prosumer = require('../../db/model/prosumer');
const Consumer = require('../../db/model/consumer');
const User = require('../../db/model/user');

// Set simulation speed in ms
const TIME_MULTIPLIER = 5000;

// These are basically reset everytime the simulation starts. Would be a good idea to get the previous
// data from the database instead.
const market = new MarketSim('Lulea', 2, 5000, 100000);
const weather = new WeatherSim('Lulea', 10, 20);

var prosumerNames = [];
var consumerNames = [];

var prosumerMap = new Map();
var consumerMap = new Map();

/**
 * Initializes all simulation models with data from the database.
 * Currently only support a single market.
 */
async function init () {
    console.log('Initializing simulator...');
    // Get all unique names of prosumers and consumers from DB
    await updateNameArrays();

    // Create new sim models
    for (const name of prosumerNames) {
        prosumerMap.set(name, new ProsumerSim(name, market, TIME_MULTIPLIER));
    }

    for (const name of consumerNames) {
        prosumerMap.set(name, new ConsumerSim(name, market, TIME_MULTIPLIER));
    }

    console.log('Prosumers: ' + prosumerNames);
    console.log('Consumers: ' + consumerNames);
}

async function updateNameArrays () {
    await Prosumer.distinct('name', function (err, res) {
        if (err) {
            console.error(err);
        } else {
            prosumerNames = res;
        }
    });

    await Consumer.distinct('name', function (err, res) {
        if (err) {
            console.error(err);
        } else {
            consumerNames = res;
        }
    });
}

/**
 * Searches for new prosumers/consumers in the databse and adds them to the simulation.
 */
async function searchForNewUsers () {
    await updateNameArrays();

    for (const name of prosumerNames) {
        if (!prosumerMap.has(name)) {
            prosumerMap.set(name, new ProsumerSim(name, market, TIME_MULTIPLIER));
        }
    }

    for (const name of consumerNames) {
        if (!consumerMap.has(name)) {
            consumerMap.set(name, new ConsumerSim(name, market, TIME_MULTIPLIER));
        }
    }
}

function simLoop () {
    setTimeout(async function () {
        searchForNewUsers();
        weather.update();
        market.generateProduction();

        for (const [_, prosumer] of prosumerMap) {
            await prosumer.fetchData();
            prosumer.generateProduction(weather.weather.wind_speed);
            prosumer.generateConsumption();
        }

        for (const [_, consumer] of consumerMap) {
            await consumer.fetchData();
            consumer.generateConsumption();
        }

        for (const [_, prosumer] of prosumerMap) {
            prosumer.update();
        }

        for (const [_, consumer] of consumerMap) {
            consumer.update();
        }

        market.update();
        console.log('Wind speed: ' + weather.weather.wind_speed);

        simLoop();
    }, TIME_MULTIPLIER);
}

async function main () {
    await init();
    console.log('Simulator now running... ');
    simLoop();
}

module.exports = { main, init };
