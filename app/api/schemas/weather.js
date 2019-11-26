const graphql = require('graphql');
const Weather = require('../../model/weather');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, 
    GraphQLInt, GraphQLFloat, GraphQLNonNull 
} = graphql;



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

const WeatherMutations = {
    addWeather: {
        type: WeatherType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            description: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parent, args) {
            let weather = new Weather({
                name: args.name,
                description: args.description,
            });
            return weather.save();
        }
    },
};

module.exports = {WeatherType, WeatherQueries, WeatherMutations};