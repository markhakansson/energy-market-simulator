const express = require('express');
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const session = require('express-session');
const mongoose = require('mongoose');
const schema = require('./api/schema');
const User = require('./db/model/user');
const passport = require('passport');
const { local } = require('./api/auth/local');

// const main = require('./sim/controller/main')

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true }); 
mongoose.connection.on('error', console.log.bind(console, "CONNECTION ERROR!"));
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

/**
 * Express
 */
const app = express();
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

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findbyId(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use('/local', local);
app.use('/graphql', express_graphql({
    schema,
    graphiql: true
})); 
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
