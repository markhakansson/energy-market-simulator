const Consumer = require('./model/consumer');
const Market = require('./model/market');
const Prosumer = require('./model/prosumer');
const Weather = require('./model/weather');

main();

function main() {

    const market = new Market("elon", 2);

    const consumer1 = new Consumer("Hakansson", market, Date.now());
    const consumer2 = new Consumer("Strandberg", market, Date.now());


}




