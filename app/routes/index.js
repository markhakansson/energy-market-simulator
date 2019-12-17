const express = require('express');
const router = express.Router();
const expressGraphql = require('express-graphql');
const schema = require('../api/schema');
const passport = require('passport');
const isLoggedIn = require('../api/auth/auth').isLoggedIn;
const isAdmin = require('../api/auth/auth').isAdmin;
const Prosumer = require('../db/model/prosumer');
const User = require('../db/model/user');


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

router.get('/success', isLoggedIn, async function (req, res, next) {
    // res.render('prosumer', { message: req.session.username, updateMessage: '' });
   
    const user = await User.findOne( { username: req.session.username });
    if(user.role == 'admin') {
        res.redirect('/admin?username=' + req.user.username);
    } else if(user.role == 'normal') {
        res.redirect('/prosumer?username=' + req.user.username);
    } else {
        req.logout();
        res.redirect('/');

    }
});

router.get('/admin', isAdmin, function(req, res, next) {
    res.render('manager', { message: req.session.username });

});

router.get('/prosumer', isLoggedIn, async function(req, res, next) {
    const prosumer = await Prosumer.findOne( { name: req.session.username });
    res.render('prosumer', {
        message: prosumer.name,
        useBatteryRatioDefault: prosumer.useBatteryRatio,
        fillBatteryRatioDefault: prosumer.fillBatteryRatio
    });
})

router.get('/signup', function (req, res, next) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
})

router.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), function (req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
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
