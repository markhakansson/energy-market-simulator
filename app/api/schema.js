const graphql = require('graphql');

const ConsumerQueries = require('./schemas/consumer').ConsumerQueries;
const MarketQueries = require('./schemas/market').MarketQueries;
const ProsumerQueries = require('./schemas/prosumer').ProsumerQueries;
const WeatherQueries = require('./schemas/weather').WeatherQueries;

const ConsumerMutations = require('./schemas/consumer').ConsumerMutations;
const MarketMutations = require('./schemas/market').MarketMutations;
const ProsumerMutations = require('./schemas/prosumer').ProsumerMutations;
const WeatherMutations = require('./schemas/weather').WeatherMutations;

const { 
    GraphQLObjectType,
    GraphQLSchema, 
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        ...ConsumerQueries,
        ...ProsumerQueries,
        ...MarketQueries,
        ...WeatherQueries,
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...ConsumerMutations,
        ...ProsumerMutations,
        ...MarketMutations,
        ...WeatherMutations,
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});