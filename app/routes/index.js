const express = require('express');
const router = express.Router();
const expressGraphql = require('express-graphql');
const schema = require('../api/schema');
const passport = require('passport');
// const isLoggedIn = require('../api/auth/auth').isLoggedIn;
// const isAdmin = require('../api/auth/auth').isAdmin;
const Prosumer = require('../db/model/prosumer');
const User = require('../db/model/user');


router.get('/', function (req, res, next) {
    res.redirect('/login');
});


router.get('/success', isLoggedIn, async function (req, res, next) {
    // res.render('prosumer', { message: req.session.username, updateMessage: '' });
    // res.redirect('/graphql');
    // const user = await User.findOne( { username: req.session.username });
    // if(user.role == 'admin') {
    //     res.redirect('/admin?username=' + req.user.username);
    // } else if(user.role == 'normal') {
    //     res.redirect('/prosumer?username=' + req.user.username);
    // } else {
    //     req.logout();
    //     res.redirect('/');

    // }
});


router.get('/prosumer', isLoggedIn, async function(req, res, next) {
    const prosumer = await Prosumer.findOne( { name: req.session.username });
    res.render('prosumer', {
        message: prosumer.name,
        useBatteryRatioDefault: prosumer.useBatteryRatio,
        fillBatteryRatioDefault: prosumer.fillBatteryRatio
    });
})

router.get('/signup', isLoggedIn, function (req, res) {
        res.render('signup.ejs');
})

router.get('/login', isLoggedIn, function(req, res) {
    res.render('login.ejs');
})
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/graphql', expressGraphql(req => ({
    schema,
    graphiql: true,
    context: req,
}))); 
  
router.get('*', function (req, res) {
    res.render('404');
})


function isLoggedIn(req, res, next) {
    if(req.session.user && req.session.cookie) {
        res.redirect('/success')
    }
    next();

}

module.exports = router;
