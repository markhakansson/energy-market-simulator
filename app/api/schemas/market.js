const graphql = require('graphql');
const Market = require('../../db/model/market');
const graphqlIsoDate = require('graphql-iso-date');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat,
    GraphQLList,GraphQLNonNull 
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const MarketType = new GraphQLObjectType({
    name: 'Market',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLDateTime },
        price: { type: GraphQLFloat },
        battery: { type: GraphQLFloat },
        consumption: { type: GraphQLFloat },
        demand: { type: GraphQLFloat },
        currBatteryCap: { type: GraphQLFloat },
        maxBatteryCap: { type: GraphQLFloat },
    })
});

const MarketQueries = ({
    market: {
        type: MarketType,
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Market.findOne({name: args.name}).sort({timestamp: -1});
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
            maxBatteryCap: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve(parent, args) {
            let market = new Market({
                name: args.name,
                price: args.price,
                battery: args.battery,
                consumption: 0,
                demand: 0,
                maxBatteryCap: args.maxBatteryCap,
                currBatteryCap: 0,
            });
            return market.save();
        }
    },
    updatePrice: {
        type: MarketType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            price: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parent, args) {
            let filter = { name: args.name };
            let data = Market.findOne(filter).sort({timestamp: -1}).exec();
            data.then(
                function(doc) {
                    let market = new Market({
                        name: doc.name,
                        price: args.price,
                        battery: doc.battery,
                        consumption: doc.consumption,
                        demand: doc.demand,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                    });
                    market.save();
                },
                function(err) {
                    console.error(err);
                }
            );
        }
    }
};

module.exports = {MarketType, MarketQueries, MarketMutations};