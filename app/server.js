const express = require('express');
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./api/schema');
const jwt = require('express-jwt')
const User = require('../../db/model/user');

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


// authentication middleware
const auth = jwt({secret: 'somesuperdupersecret'})


app.get('/user', (req, res) => {
  req.json('test')
});


app.post('/user/register', auth, (req, res) => {
  if(!req.user) {
    return res.status(401).send('User does not exists!');
  }

  // const user = new User( {
  //   user
  // })

  res.json( {
    message: 'User created',
  
  })
})
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