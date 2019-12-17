const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const User = require('./db/model/user');


// Loads the '.env' file in root to process.env.
require('dotenv').config();

// require('./sim/controller/main').main();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.log.bind(console, 'CONNECTION ERROR!'));
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

// const user = new User({
//     username: "1",
//     password: "1",
//     role: "admin"
// });
// user.save();
/**
 * Express
 */
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json({
    limit: '5mb', // Image size restriction
    extended: true
    }
));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
    }
));

app.use(express.static('public'));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // If true this will cause race cond in our case, "Typically, you'll want false." See express session doc
        saveUninitialized: true,
        cookie: { maxAge: 600000 }
    })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie(process.env.SESSION_SECRET);        
    }
    next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', routes);

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
