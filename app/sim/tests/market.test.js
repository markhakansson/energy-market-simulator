const expect = require('chai');
const assert = require('assert');
const MarketSim = require('../model/market');

describe('#buy0', function () {
    it('should return 0', () => {
        const marketTest = new MarketSim('test', 2, 1000, 10000, 1);
        assert.strictEqual(marketTest.buy(1000), 0);
    });
});

describe('#sell0', function () {
    it('should return 0', () => {
        const marketTest = new MarketSim('test', 2, 1000, 0, 1);
        assert.strictEqual(marketTest.sell(0), 0);
    });
});

describe('#StartUp', function () {
    it('status should be true and status is startup', () => {
        const marketTest = new MarketSim('test', 2, 10, 10, 1);
        marketTest.generateProduction();
        assert.strictEqual(marketTest.market.startUp, true);
        assert.strictEqual(marketTest.market.status, 'startup!');
    });
});

describe('#Running', function () {
    it('status should be running', () => {
        const marketTest = new MarketSim('test', 2, 10, 10, 1);
        marketTest.market.currBatteryCap = -1;
        marketTest.generateProduction();
        setTimeout(() => {
            assert.strictEqual(marketTest.status, 'running!');
            assert.strictEqual(marketTest.market.startUp, true);
        }, 3000);
    });
});

describe('#Stopped', function () {
    it('status should be stopped and start up false', () => {
        const marketTest = new MarketSim('test', 2, 10, 10, 1);
        marketTest.market.startUp = false;
        marketTest.generateProduction();
        assert.strictEqual(marketTest.market.startUp, false);
        assert.strictEqual(marketTest.status, 'stopped!');
    });
});
