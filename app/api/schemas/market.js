const graphql = require('graphql');
const Market = require('../../db/model/market');
const graphqlIsoDate = require('graphql-iso-date');
const errorMsg = require('./errors');
const Logger = require('../../config/logger')

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
    manager: {
        type: MarketType,
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            return Market.findOne({ name: req.session.user }).sort({ timestamp: -1 });
        }
    },
    market: {
        type: MarketType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            return Market.findOne({ name: args.name }).sort({ timestamp: -1 });
        }
    },
    /*
    TODO: Currently all markets prices can be queried by prosumers (logged in), would rather see it stored in prosumer itself
    */
    marketPrice: {
        type: GraphQLFloat,
        args: { name: { type: GraphQLString } },
        async resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            const market = await Market.findOne({ name: args.name }).sort({ timestamp: -1 });
            return market.price;
        }
    },
    markets: {
        type: new GraphQLList(MarketType),
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            return Market.find({});
        }
    }
});

const MarketMutations = {
    addMarket: {
        type: MarketType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            price: { type: new GraphQLNonNull(GraphQLFloat) },
            maxBatteryCap: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
                    return market.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´setMarketProduction´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´setMarketProduction´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
                    return market.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´setMarketPrice´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´setMarketPrice´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
                    return market.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´setMarketFillBatteryRatio´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´setMarketFillBatteryRatio´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
                    return market.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´setPowerPlantStatus´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´setPowerPlantStatus´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
                    return market.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´useAutopilot´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´useAutopilot´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
                }
            )
        }
    }
};

module.exports = { MarketType, MarketQueries, MarketMutations };
