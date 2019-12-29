const { expect } = require('chai');
const WeatherSim = require('../../sim/model/weather');

const illegalWind = function () {
    new WeatherSim('test', 1000, 0)
};

const illegalTemperature = function () {
    new WeatherSim('test', 1, -1000);
};

const definedConstructor = function () {
    new WeatherSim('', 10, 10);
};

describe('#illegalWind', function () {
    it('should return Error', () => {
        expect(illegalWind).to.throw(Error, 'Illegal wind speed');
    });
});

describe('#illegalTemp', function () {
    it('should return Error', () => {
        expect(illegalTemperature).to.throw(Error, 'Illegal temperature');
    });
});

describe('#definedConstructor', function () {
    it('should return Error', () => {
        expect(definedConstructor).to.throw(Error, 'Constructor arguments must be defined!');
    });
});
