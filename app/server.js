const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./api/schema');
const jwt = require('jsonwebtoken')
// const main = require('./sim/controller/main')

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true }); 
mongoose.connection.on('error', console.log.bind(console, "CONNECTION ERROR!"));
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

/**
 * Express
 */
var app = express();
/**
 * GraphQl
 */
app.use('/graphql', express_graphql({
    schema,
    graphiql: true
})); 
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
/**
 * Authentication
 */
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let data = {
        "username": username,
        "password": password
    };

    mongoose.connection.collection('secrets').find(data, (err, res) => {
        if(err) throw err;
        console.log("Logged in!")
    });

    return res.redirect('prosumer.html');
});

app.post('/sign_up', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let data = {
        "username": username,
        "password": password
    };

    mongoose.connection.collection('secrets').insertOne(data, (err, res) => {
        if(err) throw err;
        console.log(res + " inserted!")
    });

    return res.redirect('signup_success.html');
});

app.get('/', (req, res) => {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('index.html');
}).listen(3000, () => console.log('Server listening on port 3000'));



const signToken = str => {
    return new Promise(resolve => {
      resolve(jwt.sign({ apiKey: str }, process.env.JWT_KEY))
    })
  };
  
  const verifyJwt = req => {
    let token
    if (req.query && req.query.hasOwnProperty('access_token')) {
      token = req.query.access_token
    } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) reject('401: User is not authenticated')
     
        resolve(decoded)
      })
    })
  };