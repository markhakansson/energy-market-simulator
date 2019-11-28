const expect = require("chai");
const assert = require('assert');
const ProsumerSim = require('../model/prosumer');

describe('#randomizeTurbineBreaking', function() {
    it("Turbine should break", () => {
        // name, market, wind, fillBattRatio, useBattRatio, batterySize
        let ProsumerSimTest = new ProsumerSim("test", null, null, null, null, null);
        ProsumerSimTest.prosumer.turbineBreakagePercent = 1;
        ProsumerSimTest.randomizeTurbineBreaking();
        assert.equal(ProsumerSimTest.prosumer.production, 0);
        assert.equal(ProsumerSimTest.prosumer.turbineWorking, false);
        assert.equal(ProsumerSimTest.prosumer.turbineStatus, "BROKEN! REPAIRMAN CALLED!");

    });
});



