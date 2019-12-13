const gaussian = require('gaussian');
const rand = require('./random');
const Stats = require('fast-stats').Stats;

/**
 * Generates a positive number from a data set with gaussian distribution.
 * @param {*} data Array of numbers to use gaussian distribution on.
 * @param {*} decimals Number of decimals to generate.
 * @param {*} percentage Propability threshold that the generated number should be above. Value between [0.0 - 1.0].
 */
function gauss (data, decimals, percentage) {
    const stat = new Stats().push(data);
    const mean = stat.amean();
    const sd = stat.stddev();
    const variance = Math.pow(sd, 2);
    const distribution = gaussian(mean, variance);

    let random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
    let sample = distribution.pdf(random).toFixed(decimals);

    while (random < 0) {
        random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
        sample = distribution.pdf(random).toFixed(decimals);
    }

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
function gaussLimit (data, decimals, percentage, min, max) {
    const stat = new Stats().push(data);
    const mean = stat.amean();
    const sd = stat.stddev();
    const variance = Math.pow(sd, 2);
    const distribution = gaussian(mean, variance);

    let random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
    let sample = distribution.pdf(random).toFixed(decimals);

    while (random < min || random > max) {
        random = rand.getRandomFloat(mean - sd, mean + sd, decimals);
        sample = distribution.pdf(random).toFixed(decimals);
    }

    return random;
}

module.exports = { gauss, gaussLimit };
