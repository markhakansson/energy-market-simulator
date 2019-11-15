const Consumer = require('../model/consumer');
const Market = require('../model/market');
const Prosumer = require('../model/prosumer');
const Weather = require('../model/weather');



console.log("Simulator now running... ");
const market = new Market("Sweden", 2);

let weather = new Weather();

let consumer1 = new Consumer("Hakansson", market, Date.now());
let consumer2 = new Consumer("Strandberg", market, Date.now());
let prosumer1 = new Prosumer("elon", market, weather.getWindSpeed(), Date.now());

function main() {
    setTimeout(function() {
        weather.setWeather(10, "SW", "chilly breeze");
        
        prosumer1.setConsumption();
        prosumer1.setBattery(); // Does nothing

        consumer1.setConsumption();
        consumer2.setConsumption();

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


