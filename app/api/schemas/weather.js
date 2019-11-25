const graphql = require('graphql');
const Weather = require('../../model/weather');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
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

        weather: {
        type: WeatherType,
        resolve(parent, args) {
            return Weather.findById(parent.id);
        }
    }
    })
});

module.exports = WeatherType;