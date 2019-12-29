const graphql = require('graphql');
const Market = require('../../db/model/market');
const graphqlIsoDate = require('graphql-iso-date');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLFloat,
    GraphQLList, GraphQLNonNull
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
        maxBatteryCap: { type: GraphQLFloat }
    })
});

const MarketQueries = ({
    market: {
        type: MarketType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';

            return Market.findOne({ name: args.name }).sort({ timestamp: -1 });
        }
    },
    markets: {
        type: new GraphQLList(MarketType),
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';

            return Market.find({});
        }
    }
})

const MarketMutations = {
    addMarket: {
        type: MarketType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            price: { type: new GraphQLNonNull(GraphQLFloat) },
            maxBatteryCap: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const market = new Market({
                name: args.name,
                price: args.price,
                battery: args.battery,
                consumption: 0,
                demand: 0,
                maxBatteryCap: args.maxBatteryCap,
                currBatteryCap: 0
            });
            return market.save();
        }
    },
    updatePrice: {
        type: MarketType,
        args: {
            price: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const filter = { name: req.session.manager };
            const data = Market.findOne(filter).sort({ timestamp: -1 }).exec();
            data.then(
                function (doc) {
                    const market = new Market({
                        name: doc.name,
                        price: args.price,
                        battery: doc.battery,
                        consumption: doc.consumption,
                        demand: doc.demand,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap
                    });
                    market.save();
                },
                function (err) {
                    console.error(err);
                }
            );
        }
    }
};

module.exports = { MarketType, MarketQueries, MarketMutations };
