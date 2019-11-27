var assert = require('assert');
const WeatherSim = require('../model/weather');


describe('#WeatherSim', function() {
    it("should return Illegal wind speed ", function() {
        assert.throws(new WeatherSim("", 1000, 0)).to.be.rejected
    })
})