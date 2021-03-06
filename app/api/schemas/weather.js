const graphql = require('graphql');
const Weather = require('../../db/model/weather');
const graphqlIsoDate = require('graphql-iso-date');

const {
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const WeatherType = new GraphQLObjectType({
    name: 'Weather',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLDateTime },
        wind_speed: { type: GraphQLFloat },
        temperature: { type: GraphQLFloat },
        market: { type: GraphQLString }
    })
});

const WeatherQueries = {
    weather: {
        type: WeatherType,
        args: { location: { type: GraphQLString } },
        resolve (parent, args, req) {
            return Weather.findOne({ name: args.location }).sort({ timestamp: -1 });
        }
    }
}

const WeatherMutations = {};

module.exports = { WeatherType, WeatherQueries, WeatherMutations };
