var express = require('express');
var express_graphql = require('express-graphql');
const data = require('./data');
const schema = require('./schema');
/**
 * MongoDB
 * user: test
 * pwd: test
 * db: admin
 * port: 27017
 * host: 127.0.0.1
 */
const mongoose = require('mongoose');

// mongoose.connect('mongodb://<dbuser>:<dbpassword>@<MongoDB URI>')
mongoose.connect('mongodb://test:test@127.0.0.1:27017') 

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

var root = {
    course: data.getCourse,
    courses: data.getCourses
};// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema.build,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));