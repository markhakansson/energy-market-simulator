// const { buildSchema } = require('graphql');// GraphQL schema

// const build = buildSchema(`
//         type Query {
//             weather(id: Int!): Weather
//         },
//         type Weather {
//             id: ID
//             timestamp: Int
//             wind_speed: Float
//             wind_direction: String
//             description: String
//         },
//         type Consumer {
//             id: ID
//             timestamp: Int
//             consumption: Int
//         },
//         type Prosumer {
//             id: ID
//             timestamp: Int
//             consumption: Int
//             battery: Int
//             sell_market: Int
//             buy_market: Int
//         },
//         type Market {
//             id: ID
//             timestamp: Int
//             price: Int
//             battery: Int
//             consumption: Int
//             demand: Int
//         }`);

// module.exports = { build }

const graphql = require('graphql');
const Consumer = require('./model/consumer');
const Market = require('./model/market');
const Prosumer = require('./model/prosumer');
const Weather = require('./model/weather');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

const ConsumerType = new GraphQLObjectType({
    name: 'Consumer',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt }, 
        consumption: { type: GraphQLInt },
        
        consumer: {
        type: ConsumerType,
        resolve(parent, args) {
            return Consumer.findById(parent.id);
        }
    }
    })
});

const MarketType = new GraphQLObjectType({
    name: 'Market',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt },
        price: { type: GraphQLFloat },
        battery: { type: GraphQLInt },
        consumption: { type: GraphQLInt },
        demand: { type: GraphQLInt },
        
        market: {
        type: MarketType,
        resolve(parent,args){
            return Market.findById(parent.id);
        }
    }
        
    })
});

const ProsumerType = new GraphQLObjectType({
    name: 'Prosumer',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt }, 
        comsumption: { type: GraphQLInt },
        battery: { type: GraphQLInt },
        sell_market: { type: GraphQLInt },
        buy_market: { type: GraphQLInt },
        
        prosumer: {
        type: ProsumerType,
        resolve(parent, args) {
            return Prosumer.findById(parent.id);
        }
    }
    })
});

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

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        consumer: {
            type: ConsumerType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Consumer.findById(args.id);
            }
        },
        market: {
            type: MarketType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Market.findById(args.id);
            }
        },
        markets: {
            type: new GraphQLList(MarketType),
            resolve(parent, args) {
                return Market.find({});
            }
        },
        price: {
            type: GraphQLFloat,
            args: { id: { type: GraphQLID} },
            resolve(parent, args) {
                return Market.findById(args.id).price;
            }
        },
        prosumer: {
            type: ProsumerType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Prosumer.findById(args.id);
            }
        },
        weather: {
            type: WeatherType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Weather.findById(args.id);
            }
        }
    }
});
 
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

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});