// http://www.passportjs.org/packages/passport-local/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../db/model/user');
const Prosumer = require('../../db/model/prosumer');
const init = require('../../sim/controller/main').init;


passport.use('local-login', new LocalStrategy(
    {
        passReqToCallback: true
    },
    function (req, username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'Incorrect username or password!'));
            }
            if (user.comparePassword(password)) {
                req.session.username = username;
                return done(null, user);
            }
            return done(null, false, req.flash('loginMessage', 'Incorrect username or password!'));
        })
    }
));

passport.use('local-signup', new LocalStrategy(
    {
        passReqToCallback: true
    },
    function (req, username, password, done) {
        User.findOne({ username: username }, async function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                const user = new User({
                    role: 'normal',
                    username: username,
                    password: password
                });
                const prosumer = new Prosumer({
                    name: username,
                });
                await user.save();
                await prosumer.save();
                await init();
                return done(null, user);
            }
            return done(null, false, req.flash('signupMessage', 'User already exists!'));
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.logout();
    res.redirect('/');
}

module.exports = { isLoggedIn };
