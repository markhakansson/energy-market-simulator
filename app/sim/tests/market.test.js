const expect = require("chai");
const assert = require('assert');
const MarketSim = require('../model/market');


describe('#buy0', function() {
    it("should return 0", () => {
        let marketTest = new MarketSim("test", 2, 1000, 10000);
        assert.equal(marketTest.buy(1000), 0);
    });
});

describe('#sell0', function() {
    it("should return 0", () => {
        let marketTest = new MarketSim("test", 2, 1000, 0);
        assert.equal(marketTest.sell(0), 0);
    });
});

describe('#StartUp', function() {
    it("status should be true and status is starting up", () => {
        let marketTest = new MarketSim("test", 2, 10, 10);
        marketTest.generateProduction();
        assert.equal(marketTest.market.startUp, true);
        assert.equal(marketTest.market.status, "starting up...");
    });
});

describe('#Running', function() {
    it("status should be running and start up false", () => {
        let marketTest = new MarketSim("test", 2, 10, 10);
        marketTest.market.startUp = false;
        marketTest.generateProduction();
        setTimeout(() => {
            assert.equal(marketTest.market.startUp, false);
            assert.equal(marketTest.market.status, "running!");
        }, 10000);
    });
});

describe('#BlackOut', function() {
    it("status should be blackout!", () => {
        let marketTest = new MarketSim("test", 2, 10, 10);
        marketTest.market.currBatteryCap = -1;
        marketTest.generateProduction();
        assert.equal(marketTest.market.status, "BLACK OUT!!!!!");
        assert.equal(marketTest.market.startUp, true);

    });
});