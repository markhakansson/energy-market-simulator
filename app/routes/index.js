const express = require('express');
const router = express.Router();
const expressGraphql = require('express-graphql');
const schema = require('../api/schema');
const auth = require('../api/auth/auth').auth;
const isLoggedIn = require('../api/auth/auth').isLoggedIn;
const isManager = require('../api/auth/auth').isManager;


router.get('/', function (req, res, next) {
    return res.redirect('/login');
});


router.get('/success', auth, function (req, res, next) {
    if(req.session.manager) {
        return res.redirect('/manager?username=' + req.session.user);
    }
    return res.redirect('/prosumer?username=' + req.session.user);
    
});

router.get('/manager', auth, isManager, function(req, res, next) {
    return res.render('manager', { 
        message: req.session.user
    });
})


router.get('/prosumer', auth, async function(req, res, next) {
    return res.render('prosumer', {
        message: req.session.user
    
    });
})

router.get('/signup', isLoggedIn, function (req, res) {
    return res.render('signup.ejs');
})

router.get('/login', isLoggedIn,function(req, res) {
    return res.render('login.ejs');
})

router.get('/logout', function(req, res, next) {
    if(req.session.user) {
        req.session.destroy(function(err) {
            if (err) return next(err);
        });        
    }
    return res.redirect('/login');
});

router.use('/graphql', expressGraphql(req => ({
    schema,
    graphiql: true,
    context: req,
}))); 
  
router.get('/online', isManager, function(req, res, next) {
    const online = req.sessionStore.all(function(err, sessions) {
        if(err) return next(err);
        let online = [];
        Object.values(sessions).forEach(e => { online.push(e.user) });
        return online;
    });
    console.log(online);
    return res.send(online);
    
});
router.get('*', function (req, res) {
    return res.render('404');
})



module.exports = router;
