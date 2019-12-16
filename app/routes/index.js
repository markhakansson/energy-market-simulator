const express = require('express');
const router = express.Router();
const expressGraphql = require('express-graphql');
const schema = require('../api/schema');
const passport = require('passport');
const isLoggedIn = require('../api/auth/auth').isLoggedIn;
var Prosumer = require('../db/model/prosumer');

router.get('/', function (req, res, next) {
    res.redirect('/login');
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }), function (req, res) {
    req.session.username = req.user.username;
    res.redirect('/success?username=' + req.user.username);
});

router.get('/success', isLoggedIn, function (req, res, next) {
    // res.render('prosumer', { message: req.session.username, updateMessage: '' });
    res.redirect('/prosumer');
});

router.get('/signup', function (req, res, next) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
})

router.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), function (req, res) {
    res.redirect('/success?username=' + req.user.username);
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.get('/prosumer', function (req, res) {
    if (req.session.username != null) {
        console.log('Session:\n' + req.session);

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
    } else {
        res.redirect('/login');
    }
});

router.use('/graphql', isLoggedIn, expressGraphql(req => ({
    schema,
    graphiql: true,
    context: req,
}))); 
  
  

router.get('*', function (req, res) {
    res.render('404');
})

module.exports = router;