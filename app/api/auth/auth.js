// http://www.passportjs.org/packages/passport-local/
const auth = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../db/model/user');

passport.use(new LocalStrategy(
    
    (username, password, done) => {
        User.findOne( {username: username }, function(err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false); 
            }
            user.comparePassword(password, function(err, isMatch) {
                if(err) throw new Error('Incorrect password for user: ' + username);
      
                if(isMatch) {
                  return done(null, user);
                }

                return done(null, false);
      
            });
        })
    }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

auth.post('/', passport.authenticate('local', { failureRedirect: '/error'}), function(req, res) {
  res.redirect('/success?username=' + req.user.username);
});

module.exports = auth;