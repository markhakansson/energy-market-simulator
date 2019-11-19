var gaussian = require('gaussian');
var rand = require('./random');
var Stats = require('fast-stats').Stats;

/**
 * Generates a positive number from a data set with gaussian distribution.
 * @param {*} data Array of numbers to use gaussian distribution on.
 * @param {*} decimals Number of decimals to generate.
 * @param {*} percentage Propability threshold that the generated number should be above. Value between [0.0 - 1.0]. 
 */
function gauss(data, decimals, percentage) {
    var stat = new Stats().push(data);
    var mean = stat.amean();
    var sd = stat.stddev();
    var variance = Math.pow(sd,2);
    var distribution = gaussian(mean, variance);

    var random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
    var sample = distribution.pdf(random).toFixed(decimals);

   while(sample < percentage || random < 0) {
        random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
        sample = distribution.pdf(random).toFixed(decimals);
        console.log('Sample:' + sample);
    } 

    console.log('Random: ' + random);
    console.log('Sample:' + sample);

    return random;
  
}

/**
 * Generates a number from a data set with gaussian distribution within a given limit.
 * @param {*} data Array of numbers to use gaussian distribution on.
 * @param {*} decimals Number of decimals to generate.
 * @param {*} percentage Propability threshold that the generated number should be above. Value between [0.0 - 1.0]. 
 * @param {*} min Minimum value that can be generated (limit).
 * @param {*} max Maximum value that can be generated (limit).
 */
function gaussLimit(data, decimals, percentage, min, max) {
    var stat = new Stats().push(data);
    var mean = stat.amean();
    var sd = stat.stddev();
    var variance = Math.pow(sd,2);
    var distribution = gaussian(mean, variance);

    var random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
    var sample = distribution.pdf(random).toFixed(decimals);

   while(sample < percentage || random < min || random > max ) {
        random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
        sample = distribution.pdf(random).toFixed(decimals);
        console.log('Sample:' + sample);
    } 

    console.log('Random: ' + random);
    console.log('Sample:' + sample);

    return random;
  
}

module.exports = {gauss, gaussLimit};