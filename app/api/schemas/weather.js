const graphql = require('graphql');
const Weather = require('../../model/weather');
const graphqlIsoDate = require('graphql-iso-date');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, 
    GraphQLInt, GraphQLFloat, GraphQLNonNull 
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const WeatherType = new GraphQLObjectType({
    name: 'Weather',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt }, 
        wind_speed: { type: GraphQLFloat }, 
        wind_direction: { type: GraphQLString }, 
        description: { type: GraphQLString }, 
    })
});

const WeatherQueries = {
    weather: {
        type: WeatherType,
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Weather.findOne(args.name);
        }
    }
}

const WeatherMutations = {};

module.exports = {WeatherType, WeatherQueries, WeatherMutations};