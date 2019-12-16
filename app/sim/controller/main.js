const ConsumerSim = require('../model/consumer');
const MarketSim = require('../model/market');
const ProsumerSim = require('../model/prosumer');
const WeatherSim = require('../model/weather');

const Prosumer = require('../../db/model/prosumer');
const Consumer = require('../../db/model/consumer');

const market = new MarketSim('Lulea', 2, 5000, 100000);
const weather = new WeatherSim('Lulea', 10, 20);

var prosumerNames = [];
var prosumerList = [];

var consumerNames = [];
var consumerList = [];

// Only allows for a single market as of now
async function init () {
    console.log('Initializing simulator...');
    // Get all unique names of prosumers and consumers from DB
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

    // Create new sim models
    for (const name of prosumerNames) {
        prosumerList.push(new ProsumerSim(name, market));
    }

    for (const name of consumerNames) {
        consumerList.push(new ConsumerSim(name, market));
    }

    console.log('Prosumers: ' + prosumerNames);
    console.log('Consumers: ' + consumerNames);
}

function simLoop () {
    setTimeout(async function () {
        weather.update();
        market.generateProduction();

        for (const prosumer of prosumerList) {
            await prosumer.fetchData();
            prosumer.generateProduction(weather.weather.wind_speed);
            prosumer.generateConsumption();
        }

        for (const consumer of consumerList) {
            await consumer.fetchData();
            consumer.generateConsumption();
        }

        for (const prosumer of prosumerList) {
            prosumer.update();
        }

        for (const consumer of consumerList) {
            consumer.update();
        }

        market.update();
        console.log('Wind speed: ' + weather.weather.wind_speed);

        simLoop();
    }, 5000);
}

async function main () {
    await init();
    console.log('Simulator now running... ');
    simLoop();
}

module.exports = main();
