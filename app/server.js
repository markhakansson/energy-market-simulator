const express = require('express');
const main = require('./sim/controller/main');
// const express_graphql = require('express-graphql');
// const consumer = require('./api/schemas/consumer');
// const market = require('./api/schemas/market');
// const prosumer = require('./api/schemas/prosumer');
// const weather = require('./api/schemas/weather');
// const mutation = require('./api/mutation');
// const rootQuery = require('./api/rootQuery');

const simulator = require('.')

const mongoose = require('mongoose');

// mongoose.connect('mongodb://<dbuser>:<dbpassword>@<MongoDB URI>')
// mongoose.connect('mongodb://test:test@127.0.0.1:27017') 
mongoose.connect('mongodb://127.0.0.1:27017/hora') 

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// var root = {
//     course: data.getCourse,
//     courses: data.getCourses
// };// Create an express server and a GraphQL endpoint
var app = express();
// app.use('/sim', simulator);
// app.use('/graphql', express_graphql({
//     schema,
//     rootValue: root,
//     graphiql: true
// }));    
// app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));