const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const schema = require('./api/schema');
const User = require('./db/model/user');
const passport = require('passport');
const auth = require('./api/auth/auth');
const bcrypt = require('bcrypt');
const flash    = require('connect-flash');
const routes = require('./routes/index');

/**
 * resolve(parent, args, request) {
        if (!request.user) throw new Error('Only users can create favorites.');
 */

// const main = require('./sim/controller/main')

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.log.bind(console, 'CONNECTION ERROR!'));
mongoose.connection.once('open', () => {
    console.log('conneted to database');
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
app.use(
  session( { secret: 'test', resave: true, saveUninitialized: true } )
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', auth);

app.use('/graphql', express_graphql({
    schema,
    graphiql: true,
})); 

app.use(routes);

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
