const graphql = require('graphql');
const Market = require('../../model/market');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat,
    GraphQLList,GraphQLNonNull 
} = graphql;

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
    })
});

const MarketQueries = ({
    market: {
        type: MarketType,
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Market.findOne({name: args.name});
        }
    },
    markets: {
        type: new GraphQLList(MarketType),
        resolve(parent, args) {
            return Market.find({});
        }
    },        
})

const MarketMutations = {
    addMarket: {
        type: MarketType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            price: { type: new GraphQLNonNull(GraphQLFloat) },
            battery: { type: new GraphQLNonNull(GraphQLInt) }, 
            consumption: { type: new GraphQLNonNull(GraphQLInt) },
            demand: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve(parent, args) {
            let market = new Market({
                name: args.name,
                price: args.price,
                battery: args.battery,
                consumption: args.consumption,
                demand: args.demand
            });
            return market.save();
        }
    },
};

module.exports = {MarketType, MarketQueries, MarketMutations};