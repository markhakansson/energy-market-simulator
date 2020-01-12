const expect = require('chai');
const assert = require('assert');
const ProsumerSim = require('../model/prosumer');
const MarketSim = require('../model/market');

describe('#randomizeTurbineBreaking', function () {
    it('Turbine should break', () => {
        // name, market, wind, fillBattRatio, useBattRatio, batterySize
        const MarketSimTest = new MarketSim('test', 2, 1000, 10000, 1);
        const ProsumerSimTest = new ProsumerSim('test', MarketSimTest, 1);
        ProsumerSimTest.prosumer.turbineBreakPercent = 1;
        ProsumerSimTest.randomizeTurbineBreaking();
        assert.strictEqual(ProsumerSimTest.prosumer.production, 0);
        assert.strictEqual(ProsumerSimTest.turbineWorking, false);
        assert.strictEqual(ProsumerSimTest.turbineStatus, 'BROKEN! REPAIRMAN CALLED!');
    });
});
