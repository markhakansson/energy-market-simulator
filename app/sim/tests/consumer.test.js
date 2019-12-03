const expect = require('chai');
const assert = require('assert');
const ConsumerSim = require('../model/consumer');

describe('#setConsumption', function () {
    it('should be 1', () => {
        const ConsumerSimTest = new ConsumerSim('test', null);
        ConsumerSimTest.setConsumption(1);
        assert.equal(ConsumerSimTest.consumer.consumption, 1);
    });
});
