// http://www.passportjs.org/packages/passport-local/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../db/model/user');

passport.use('local-login', new LocalStrategy(
    {        
      passReqToCallback : true
    },
    function(req, username, password, done) {
        User.findOne( {username: username }, function(err, user) {
            if (err) { 
                return done(err); 
            }
            if (!user) { 
                return done(null, false, req.flash('loginMessage', 'Incorrect username or password!')); 
            }
            user.comparePassword(password, function(err, isMatch) {
      
                if(isMatch) {
                  req.session.username = username;
                  return done(null, user);
                }

                return done(null, false, req.flash('loginMessage', 'Incorrect username or password!'));
      
            });
        })
    }
));

passport.use('local-signup', new LocalStrategy(
  {
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne( { username: username }, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        let user = new User({
          role: 'normal',
          username: username,
          password: password
        });
        user.save();
        return done(null, user);
      }
      return done(null, false, req.flash('signupMessage', 'User already exists!'));
    });
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


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.logout();
  res.redirect('/');
}

module.exports = isLoggedIn;