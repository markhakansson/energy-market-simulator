// http://www.passportjs.org/packages/passport-local/
const auth = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../db/model/user');

passport.use(new LocalStrategy(
    
    (username, password, done) => {
        User.findOne( {username: username }, (err, user) => {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false); 
            }
            if (!user.verifyPassword(password)) { 
                return done(null, false); 
            }
            return done(null, user);
        })
    }
));

auth.get('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

module.exports = auth;