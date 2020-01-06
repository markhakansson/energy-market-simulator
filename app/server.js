const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const User = require('./db/model/user');

// Loads the '.env' file in root to process.env.
require('dotenv').config();

// require('./sim/controller/main').main();

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.log.bind(console, 'CONNECTION ERROR!'));
mongoose.connection.on('disconnected', console.log.bind(console, 'CONNECTION DISCONNECTED!'))
// mongoose.connection.once('open', () => {
//     console.log('connected to database');
// });

// const user = new User({
//     username: "1",
//     password: "1",
//     manager: true,
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
        saveUninitialized: false, 
                                    // Forces a session that is "uninitialized" to be saved to the store. 
                                    // A session is uninitialized when it is new but not modified. 
                                    // Choosing false is useful for implementing login sessions, reducing server storage usage,
                                    //  or complying with laws that require permission before setting a cookie. 
        cookie: { maxAge: false }
    })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie(process.env.SESSION_SECRET);        
    }
    next();
});

// const exit = function() { 
//     mongoose.connection.close(function () {
//       console.log('database connection closed');
//       process.exit(0);
//     });
//   }

// // Make sure to close the connection when node is closed.
// process.on('SIGINT', exit).on('SIGTERM', exit);

app.use('/', routes);

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

