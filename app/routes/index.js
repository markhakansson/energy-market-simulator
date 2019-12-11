var express = require('express');
var router = express.Router();
var passport = require('../api/auth/auth').passport;

router.get('/prosumer', function (req, res) {
    console.log(req.session);
    res.render('prosumer', {message: req.session.username});
});

module.exports = router;