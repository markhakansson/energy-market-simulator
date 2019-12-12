var express = require('express');
var router = express.Router();
var Prosumer = require('../db/model/prosumer');

router.get('/prosumer', function (req, res) {
    console.log(req.session);
    const query = Prosumer.findOne({ name: req.session.username }).sort({ timestamp: -1 });
    query.exec(function (err, prosumer) {
        if (err) {
            console.log(err);
        } else {
            res.render('prosumer', {
                message: prosumer.name,
                useBatteryRatioDefault: prosumer.useBatteryRatio,
                fillBatteryRatioDefault: prosumer.fillBatteryRatio
            });
        }
    });
});

module.exports = router;
