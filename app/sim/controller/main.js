const ConsumerSim = require('../model/consumer');
const MarketSim = require('../model/market');
const ProsumerSim = require('../model/prosumer');
const WeatherSim = require('../model/weather');



console.log("Simulator now running... ");
// name, price, production, maxBatteryCap
let market = new MarketSim("Sweden", 2, 5000, 100000);
// name, wind_speed, temperature
let weather = new WeatherSim("sun", 10, 20);

// name, market
let consumer1 = new ConsumerSim("Hakansson", market);
let consumer2 = new ConsumerSim("Strandberg", market);

// name, market, fillBattRatio, useBattRatio, batterySize
let prosumer1 = new ProsumerSim("elon", market, 0.5, 0.5, 1000);

function main() {
    setTimeout(function() {
        weather.update();
        market.generateProduction();

        prosumer1.generateProduction(weather.weather.wind_speed);
        prosumer1.generateConsumption();


        consumer1.generateConsumption();
        consumer2.generateConsumption();

        prosumer1.update();
        consumer1.update();
        consumer2.update();
        market.update();
        console.log(weather.weather.wind_speed);



        main();

    }, 2000);
}     
 
module.exports = main();


