const express = require('express');
const router = express.Router();
const express_graphql = require('express-graphql');
const schema = require('../api/schema');
const passport = require('passport');
const isLoggedIn = require('../api/auth/auth').isLoggedIn;
const updatePassword = require('../api/auth/auth').updatePassword;


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
    res.render('prosumer', { message: req.session.username, updateMessage: "" });
});

router.get('/signup', function(req, res, next) {
    res.render('signup.ejs', {message: req.flash('signupMessage')});
})

router.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), function(req, res) {
    res.redirect('/success?username=' + req.user.username);
});

router.post('/update', isLoggedIn, updatePassword);

// router.post('/upload', isLoggedIn);


router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/graphql', isLoggedIn, express_graphql(req => ({
    schema,
    graphiql: true,
    context: req,
}))); 
  
  

module.exports = router;