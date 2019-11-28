const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./api/schema');
const main = require('./sim/controller/main')

const simulator = require('.')

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true }); 

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// Create an express server and a GraphQL endpoint
var app = express();
// app.use('/sim', simulator);
app.use('/graphql', express_graphql({
    schema,
    graphiql: true
}));    
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
