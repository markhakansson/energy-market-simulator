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
        wind_direction: { type: GraphQLString },
        description: { type: GraphQLString }
    })
});

const WeatherQueries = {
    adminWeather: {
        type: WeatherType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (req.isAuthenticated()) {
                if (req.user.role === 'admin') {
                    return Weather.findOne({ name: args.name }).sort({ timestamp: -1 });
                }
            }
        }
    },
    weather: {
        type: WeatherType,
        resolve (parent, args, req) {
            return Weather.findOne({ name: req.user.username }).sort({ timestamp: -1 });
        }
    }
}

const WeatherMutations = {};

module.exports = { WeatherType, WeatherQueries, WeatherMutations };
