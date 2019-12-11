const express = require('express');
const router = express.Router();
const express_graphql = require('express-graphql');
const schema = require('../api/schema');
const passport = require('passport');
const isLoggedIn = require('../api/auth/auth');
const query = require('graphql').graphql;

router.get('/prosumer', function (req, res) {
    res.render('prosumer', {message: req.session.username});
});

router.get('/', function(req, res, next) {
    res.redirect('/login');
});

router.get('/login', function(req, res, next) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/success?username=' + req.user.username);
});

router.get('/success', isLoggedIn, function (req, res, next) {
    // let q = `{
    //     prosumer(name:"${req.session.username}"){production,consumption,currBatteryCap}
    // }`;
 
    // query(schema, q, null, req).then(result => {
    //     res.render('prosumer',  {
    //         message: req.session.username,
    //         production: result.data.prosumer.production,
    //         consumption: result.data.prosumer.consumption
    //     });
    // });
    res.render('prosumer', { message: req.session.username });
    
    // res.redirect('/graphql');
});

router.get('/signup', function(req, res, next) {
    res.render('signup.ejs', {message: req.flash('signupMessage')});
})

router.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), function(req, res) {
    res.redirect('/success?username=' + req.user.username);
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/graphql', isLoggedIn, express_graphql(req => ({
    schema,
    graphiql: true,
    context: req
}))); 
  
  

module.exports = router;