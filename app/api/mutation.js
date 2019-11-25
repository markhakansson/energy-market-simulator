const graphql = require('graphql');


const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;




//helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addConsumer: {
            type: ConsumerType,
            args: {
                timestamp: { type: new GraphQLNonNull(GraphQLInt) }, 
                consumption: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                let consumer = new Consumer({
                    timestamp: args.timestamp,
                    consumption: args.consumption
                });
                return consumer.save();
            }
        },
        addMarket: {
            type: MarketType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                timestamp: { type: new GraphQLNonNull(GraphQLInt) }, 
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                battery: { type: new GraphQLNonNull(GraphQLInt) }, 
                consumption: { type: new GraphQLNonNull(GraphQLInt) },
                demand: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                let market = new Market({
                    name: args.name,
                    timestamp: args.timestamp,
                    price: args.price,
                    battery: args.battery,
                    consumption: args.consumption,
                    demand: args.demand
                });
                return market.save();
            }
        },
        addProsumer: {
            type: ProsumerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                timestamp: { type: new GraphQLNonNull(GraphQLInt) }, 
                consumption: { type: new GraphQLNonNull(GraphQLInt) },
                battery: { type: new GraphQLNonNull(GraphQLInt) }, 
                sell_market: { type: new GraphQLNonNull(GraphQLInt) },
                buy_market: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                let prosumer = new Prosumer({
                    timestamp: args.timestamp,
                    consumption: args.consumption,
                    battery: args.battery,
                    sell_market: args.sell_market,
                    buy_market: args.buy_market
                });
                return prosumer.save();
            }
        },
        addWeather: {
            type: WeatherType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                timestamp: { type: new GraphQLNonNull(GraphQLInt) }, 
                wind_speed: { type: new GraphQLNonNull(GraphQLFloat) },
                wind_direction: { type: new GraphQLNonNull(GraphQLString) }, 
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let weather = new Weather({
                    name: args.name,
                    timestamp: args.timestamp,
                    wind_speed: args.wind_speed,
                    wind_direction: args.wind_direction,
                    description: args.description
                });
                return weather.save();
            }
        },
    }
});



module.exports = new GraphQLSchema({ mutation: Mutation });