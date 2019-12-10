// http://www.passportjs.org/packages/passport-local/
const auth = require('express').Router();
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

auth.get('/', function(req, res, next) {
  res.redirect('/login');
});

auth.get('/login', function(req, res, next) {
  res.render('login.ejs', {message: req.flash('loginMessage')});
});

auth.post('/login', passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
  res.redirect('/success?username=' + req.user.username);
});

auth.get('/success', isLoggedIn, function (req, res, next) {
  res.send("Welcome " + req.query.username+ "!!")
});

auth.get('/signup', function(req, res, next) {
  res.render('signup.ejs', {message: req.flash('signupMessage')});
})

auth.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), function(req, res) {
  res.redirect('/success?username=' + req.user.username);
});

auth.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = auth;