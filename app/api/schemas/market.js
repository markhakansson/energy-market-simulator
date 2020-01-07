const graphql = require('graphql');
const Market = require('../../db/model/market');
const graphqlIsoDate = require('graphql-iso-date');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLFloat,
    GraphQLList, GraphQLNonNull,
    GraphQLBoolean
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
        demand: { type: GraphQLFloat },
        status: { type: GraphQLString },
        startUp: { type: GraphQLBoolean },
        price: { type: GraphQLFloat },
        production: { type: GraphQLFloat },
        consumption: { type: GraphQLFloat },
        currBatteryCap: { type: GraphQLFloat },
        maxBatteryCap: { type: GraphQLFloat },
        fillBatteryRatio: { type: GraphQLFloat },
        autopilot: { type: GraphQLBoolean },
        recommendedPrice: { type: GraphQLFloat },
        recommendedProduction: { type: GraphQLFloat },
        manualProduction: { type: GraphQLFloat },
        manualPrice: { type: GraphQLFloat }
    })
});

const MarketQueries = ({
    market: {
        type: MarketType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';
            return Market.findOne({ name: req.session.user }).sort({ timestamp: -1 });
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
                timestamp: Date.now(),
                demand: 0,
                status: 'stopped!',
                startUp: true,
                price: args.price,
                production: 10000,
                consumption: 1000,
                currBatteryCap: 0,
                maxBatteryCap: args.maxBatteryCap,
                fillBatteryRatio: 0.0,
                autopilot: true,
                recommendedPrice: 0,
                recommendedProduction: 0,
                manualProduction: 0,
                manualPrice: 0
            });
            return market.save();
        }
    },
    setMarketProduction: {
        type: GraphQLBoolean,
        args: {
            production: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const data = Market.findOne({ name: req.session.user }).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const market = new Market({
                        name: doc.name,
                        timestamp: Date.now(),
                        demand: doc.demand,
                        status: doc.status,
                        startUp: doc.startUp,
                        price: doc.price,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        autopilot: doc.autopilot,
                        recommendedPrice: doc.recommendedPrice,
                        recommendedProduction: doc.recommendedProduction,
                        manualProduction: args.production,
                        manualPrice: doc.manualPrice
                    });
                    market.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            )
        }
    },
    setMarketPrice: {
        type: GraphQLBoolean,
        args: {
            price: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const filter = { name: req.session.user };
            const data = Market.findOne(filter).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const market = new Market({
                        name: doc.name,
                        timestamp: Date.now(),
                        demand: doc.demand,
                        status: doc.status,
                        startUp: doc.startUp,
                        price: doc.price,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        autopilot: doc.autopilot,
                        recommendedPrice: doc.recommendedPrice,
                        recommendedProduction: doc.recommendedProduction,
                        manualProduction: doc.manualProduction,
                        manualPrice: args.price
                    });
                    market.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            );
        }
    },
    setMarketFillBatteryRatio: {
        type: GraphQLBoolean,
        args: {
            fillBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const data = Market.findOne({ name: req.session.user }).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const market = new Market({
                        name: doc.name,
                        timestamp: Date.now(),
                        demand: doc.demand,
                        status: doc.status,
                        startUp: doc.startUp,
                        price: doc.price,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: args.fillBatteryRatio,
                        autopilot: doc.autopilot,
                        recommendedPrice: doc.recommendedPrice,
                        recommendedProduction: doc.recommendedProduction,
                        manualProduction: doc.manualProduction,
                        manualPrice: doc.manualPrice
                    });
                    market.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            )
        }

    },
    setPowerPlantStatus: {
        type: GraphQLBoolean,
        args: {
            enable: { type: new GraphQLNonNull(GraphQLBoolean) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const data = Market.findOne({ name: req.session.user }).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const market = new Market({
                        name: doc.name,
                        timestamp: Date.now(),
                        demand: doc.demand,
                        status: doc.startUp,
                        startUp: args.enable,
                        price: doc.price,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        autopilot: doc.autopilot,
                        recommendedPrice: doc.recommendedPrice,
                        recommendedProduction: doc.recommendedProduction,
                        manualProduction: doc.manualProduction,
                        manualPrice: doc.manualPrice
                    });
                    market.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            )
        }
    },
    useAutopilot: {
        type: GraphQLBoolean,
        description: 'Set the autopilot mode of market simulator',
        args: {
            enable: { type: new GraphQLNonNull(GraphQLBoolean) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            const data = Market.findOne({ name: req.session.user }).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const market = new Market({
                        name: doc.name,
                        timestamp: Date.now(),
                        demand: doc.demand,
                        status: doc.status,
                        startUp: doc.startUp,
                        price: doc.price,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        autopilot: args.enable,
                        recommendedPrice: doc.recommendedPrice,
                        recommendedProduction: doc.recommendedProduction,
                        manualProduction: doc.manualProduction,
                        manualPrice: doc.manualPrice
                    });
                    market.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            )
        }
    }
};

module.exports = { MarketType, MarketQueries, MarketMutations };
