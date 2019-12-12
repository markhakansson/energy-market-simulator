const graphql = require('graphql');
const Prosumer = require('../../db/model/prosumer');
const graphqlIsoDate = require('graphql-iso-date');
const cookieParser = require('cookie-parser');

const {
    GraphQLObjectType, GraphQLString, GraphQLFloat,
    GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLBoolean
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const ProsumerType = new GraphQLObjectType({
    name: 'Prosumer',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        market: { type: GraphQLString },
        currBatteryCap: { type: GraphQLFloat },
        consumption: { type: GraphQLFloat },
        timestamp: { type: GraphQLDateTime },
        production: { type: GraphQLFloat },
        maxBatteryCap: { type: GraphQLFloat },
        fillBatteryRatio: { type: GraphQLFloat },
        useBatteryRatio: { type: GraphQLFloat },
        bought: { type: GraphQLFloat },
        blackout: { type: GraphQLFloat },
    })
});

const ProsumerQueries = {
    prosumer: {
        type: ProsumerType,
        resolve (parent, args, req) {
            console.log(req.session);
            return Prosumer.findOne({ name: req.session.username }).sort({ timestamp: -1 });
        }
    },
};

const ProsumerMutations = {
    addProsumer: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            market: { type: new GraphQLNonNull(GraphQLString) },
            maxBatteryCap: { type: new GraphQLNonNull(GraphQLInt) }
        },
        resolve (parent, args) {
            const prosumer = new Prosumer({
                name: args.name,
                market: args.market,
                consumption: 0,
                production: 0,
                fillBatteryRatio: 0,
                useBatteryRatio: 0,
                currBatteryCap: 0,
                maxBatteryCap: args.maxBatteryCap,
                timestamp: Date.now()
            });
            prosumer.save();
            return prosumer;
        }
    },
    updateFillBatteryRatio: {
        type: GraphQLBoolean,
        args: {
            name: { type: new GraphQLNonNull(GraphQLFloat) },
            fillBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args) {
            const filter = { name: args.name };
            const data = Prosumer.findOne(filter).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: args.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        timestamp: Date.now()
                    });
                    prosumer.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            );
        }
    },
    updateUseBatteryRatio: {
        type: GraphQLBoolean,
        args: {
            name: { type: new GraphQLNonNull(GraphQLFloat) },
            useBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args) {
            const filter = { name: args.name };
            const data = Prosumer.findOne(filter).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: args.useBatteryRatio,
                        timestamp: Date.now()
                    });
                    prosumer.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            );
        }
    },
    updateProsumerProduction: {
        type: GraphQLBoolean,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            production: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args) {
            const filter = { name: args.name };
            const data = Prosumer.findOne(filter).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: args.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        timestamp: Date.now()
                    });
                    prosumer.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            );
        }
    },
    updateProsumerConsumption: {
        type: GraphQLBoolean,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            consumption: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args) {
            const filter = { name: args.name };
            const data = Prosumer.findOne(filter).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    const prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: doc.production,
                        consumption: args.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        timestamp: Date.now()
                    });
                    prosumer.save();
                    return true;
                },
                err => {
                    console.error(err);
                    return false;
                }
            );
        }
    }
};

module.exports = { ProsumerType, ProsumerQueries, ProsumerMutations };
