const expect = require("chai");
const assert = require('assert');
const ProsumerSim = require('../model/prosumer');

describe('#randomizeTurbineBreaking', function() {
    it("Turbine should break", () => {
        // name, market, wind, fillBattRatio, useBattRatio, batterySize
        let ProsumerSimTest = new ProsumerSim("test", null);
        ConsumerSimTest.setConsumption(1);
        assert.equal(ConsumerSimTest.consumer.consumption, 1);
    });
});



