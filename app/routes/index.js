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


router.get('/success', auth, function (req, res, next) {
    if(req.session.manager) {
        res.redirect('/manager?username' + req.session.user);
    }
    res.redirect('/prosumer?username=' + req.session.user);
    
});

router.get('/manager', auth, isManager, function(req, res, next) {
    res.render('manager', { 
        message: req.session.user
    });
})


router.get('/prosumer', auth, async function(req, res, next) {
    res.render('prosumer', {
        message: req.session.user
    
    });
})

router.get('/signup', isLoggedIn, function (req, res) {
    res.render('signup.ejs');
})

router.get('/login', isLoggedIn,function(req, res) {
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

function auth(req, res, next) {
    if(req.session.user && req.session.cookie) {
        next();
    }
    res.redirect('/logout');
}
function isManager(req, res, next) {
    if(req.session.manager) {
        next();
    }
    res.redirect('/');
}

function isLoggedIn(req, res, next) {
    if(req.session.user && req.session.cookie) {
        res.redirect('/success');
    }
    next();
}

module.exports = router;
