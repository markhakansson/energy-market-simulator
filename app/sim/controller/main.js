const Consumer = require('../model/consumer');
const Market = require('../model/market');
const Prosumer = require('../model/prosumer');
const Weather = require('../model/weather');



console.log("Simulator now running... ");
const market = new Market("Sweden", 2, 10000);

let weather = new Weather();

let consumer1 = new Consumer("Hakansson", market, Date.now());
let consumer2 = new Consumer("Strandberg", market, Date.now());

let prosumer1 = new Prosumer("elon", market, null, Date.now(), 0.5, 0.5, 1000);

function main() {
    setTimeout(function() {
        weather.generateWind();
        market.generateProduction();

        prosumer1.generateProduction(weather.wind_speed);
        prosumer1.generateConsumption();


        consumer1.generateConsumption();
        consumer2.generateConsumption();

        console.log("------------------------------------------------------------------------------");
        prosumer1.display();
        console.log("------------------------------------------------------------------------------");
        consumer1.display();
        console.log("------------------------------------------------------------------------------");
        consumer2.display();
        console.log("------------------------------------------------------------------------------");



        main();

    }, 5000);
}     
 
module.exports = main();


