var gaussian = require('gaussian');
var rand = require('./random');
var Stats = require('fast-stats').Stats;

/**
 * Generates a number from a data set with gaussian distribution.
 * @param {*} data Array of numbers to use gaussian distribution on.
 * @param {*} decimals Number of decimals to generate.
 */
function gauss(data, decimals) {
    var stat = new Stats().push(data);
    var mean = stat.amean();
    var sd = stat.stddev();
    var variance = Math.pow(sd,2);
    var distribution = gaussian(mean, variance);

    var random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
    var sample = distribution.pdf(random).toFixed(decimals);

    while(sample < 0.1) {
        random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
        sample = distribution.pdf(random).toFixed(decimals);
        console.log('sample: ' + sample);   
    }

    console.log('mean: ' + mean);       
    console.log('sd: ' + sd);
    console.log('variance: ' + variance);
    console.log('dist: ' + distribution);
    console.log('random: ' + random);   
    console.log('sample: ' + sample); 

    return random;
  
}

module.exports = gauss;