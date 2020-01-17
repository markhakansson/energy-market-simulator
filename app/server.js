const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');

const Logger = require('./config/logger');
const path = require('path');

// Loads the '.env' file in root to process.env.
require('dotenv').config();

require('./sim/controller/main').main();

// See https://stackoverflow.com/a/42929869 on how to add user
mongoose.connect(process.env.DB_HOST, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => {
        Logger.info('Successfully connected to database.');
    },
    err => {
        Logger.error('Could not connect to database. Error ' + err);
    }
);

/**
 * Express
 */
const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.json({
    limit: '5mb', // Image size restriction
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));

app.use(express.static('public'));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // If true this will cause race cond in our case, "Typically, you'll want false." See express session doc
        saveUninitialized: false,
        // Forces a session that is "uninitialized" to be saved to the store.
        // A session is uninitialized when it is new but not modified.
        // Choosing false is useful for implementing login sessions, reducing server storage usage,
        //  or complying with laws that require permission before setting a cookie.
        cookie: {
            maxAge: false,
            httpOnly: true
        }
    })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie(process.env.SESSION_SECRET);
    }
    next();
});

app.use('/', routes);

app.listen(4000, () => Logger.info('Express GraphQL Server Now Running On localhost:4000/graphql'));
