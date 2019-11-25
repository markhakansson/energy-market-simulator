const express = require('express');
const express_graphql = require('express-graphql');
const schema = require('./schema');
// const simulator = require('.')

const mongoose = require('mongoose');

// mongoose.connect('mongodb://<dbuser>:<dbpassword>@<MongoDB URI>')
// mongoose.connect('mongodb://test:test@127.0.0.1:27017') 
mongoose.connect('mongodb://127.0.0.1:27017/test') 

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


// var root = {
//     course: data.getCourse,
//     courses: data.getCourses
// };// Create an express server and a GraphQL endpoint
var app = express();
// app.use('/sim', simulator);
app.use('/graphql', express_graphql({
    schema,
    rootValue: root,
    graphiql: true
}));    
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));