const expect = require('chai');
const assert = require('assert');
const MarketSim = require('../../sim/model/market');

describe('#buy0', function () {
    it('should return 0', () => {
        const marketTest = new MarketSim('test', 2, 1000, 10000);
        assert.strictEqual(marketTest.buy(1000), 0);
    });
});

describe('#sell0', function () {
    it('should return 0', () => {
        const marketTest = new MarketSim('test', 2, 1000, 0);
        assert.strictEqual(marketTest.sell(0), 0);
    });
});

describe('#StartUp', function () {
    it('status should be true and status is starting up', () => {
        const marketTest = new MarketSim('test', 2, 10, 10);
        marketTest.generateProduction();
        assert.strictEqual(marketTest.market.startUp, true);
        assert.strictEqual(marketTest.market.status, 'starting up...');
    });
});

describe('#Running', function () {
    it('status should be running and start up false', () => {
        const marketTest = new MarketSim('test', 2, 10, 10);
        marketTest.market.startUp = false;
        marketTest.generateProduction();
        setTimeout(() => {
            assert.strictEqual(marketTest.market.startUp, false);
            assert.strictEqual(marketTest.market.status, 'running!');
        }, 10000);
    });
});

describe('#BlackOut', function () {
    it('status should be blackout!', () => {
        const marketTest = new MarketSim('test', 2, 10, 10);
        marketTest.market.currBatteryCap = -1;
        marketTest.generateProduction();
        assert.strictEqual(marketTest.market.status, 'BLACK OUT!!!!!');
        assert.strictEqual(marketTest.market.startUp, true);
    });
});
