function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals) {
    if(min < 0) {
        return (Math.random() * (- max) + max).toFixed(decimals);
    } else {
        return (Math.random() * (min - max) + max).toFixed(decimals);
    }
}

module.exports = {getRandomFloat, getRandomInt}