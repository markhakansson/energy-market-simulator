const express = require('express');
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const session = require('express-session');
const mongoose = require('mongoose');
const schema = require('./api/schema');
const User = require('./db/model/user');
const passport = require('passport');
const auth = require('./api/auth/auth');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');

// Loads the '.env' file in root to process.env.
require('dotenv').config();

// const main = require('./sim/controller/main')

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.log.bind(console, 'CONNECTION ERROR!'));
mongoose.connection.once('open', () => {
    console.log('connected to database');
});

/**
 * Express
 */
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 600000 }
    }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', auth);

app.use('/graphql', express_graphql({
    schema,
    graphiql: true
}));

app.use(routes);

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
