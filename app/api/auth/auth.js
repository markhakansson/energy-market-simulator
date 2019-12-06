// http://www.passportjs.org/packages/passport-local/
const auth = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../db/model/user');

passport.use(new LocalStrategy(
    
    (username, done) => {
        User.findOne( {username: username }, function(err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false); 
            }
            user.comparePassword(args.password, function(err, isMatch) {
                if(err) throw new Error('Incorrect password for user: ' + args.username);
      
                if(isMatch) {
                  return done(null, user);
                }

                return done(null, false);
      
            });
        })
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findbyId(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

auth.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' , failureFlash: true } ));

module.exports = auth;