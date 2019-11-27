const ConsumerSim = require('../model/consumer');
const MarketSim = require('../model/market');
const ProsumerSim = require('../model/prosumer');
const WeatherSim = require('../model/weather');



console.log("Simulator now running... ");
// const market = new MarketSim("Sweden", 2, 5000, 100000);

let weather = new WeatherSim("test", 100, 20);

// let consumer1 = new ConsumerSim("Hakansson", market);
// let consumer2 = new Consumer("Strandberg", market, Date.now());
// name, market, wind, fillBattRatio, useBattRatio, batterySize
// let prosumer1 = new ProsumerSim("elon", market, Date.now(), 0.5, 0.5, 1000);

function main() {
    setTimeout(function() {
        weather.update();
        // market.generateProduction();

        // prosumer1.generateProduction(weather.wind_speed);
        // prosumer1.generateConsumption();


        // consumer1.generateConsumption();
        // consumer2.generateConsumption();

        // console.log("------------------------------------------------------------------------------");
        // prosumer1.update();
        // console.log("------------------------------------------------------------------------------");
        // consumer1.update();
        // console.log("------------------------------------------------------------------------------");
        // consumer2.display();
        // console.log("------------------------------------------------------------------------------");
        // market.update();



        main();

    }, 2000);
}     
 
module.exports = main();


