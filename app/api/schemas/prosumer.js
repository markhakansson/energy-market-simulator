const graphql = require('graphql');
const Prosumer = require('../../db/model/prosumer');
const graphqlIsoDate = require('graphql-iso-date');

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
        currBatteryCap: { type: GraphQLFloat },
        consumption: { type: GraphQLFloat },
        timestamp: { type: GraphQLDateTime },
        production: { type: GraphQLFloat },
        maxBatteryCap: { type: GraphQLFloat },
        fillBatteryRatio: { type: GraphQLFloat },
        useBatteryRatio: { type: GraphQLFloat },
        bought: { type: GraphQLFloat },
        blackout: { type: GraphQLFloat },
        turbineStatus: { type: GraphQLString },
        timeMultiplier: { type: GraphQLFloat }
    })
});

const ProsumerQueries = {
    adminProsumer: {
        type: ProsumerType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (req.isAuthenticated()) {
                if (req.user.role === 'admin') {
                    return Prosumer.findOne({ name: args.name });
                }
            }
        }
    },
    prosumer: {
        type: ProsumerType,
        resolve (parent, args, req) {
            if (req.isAuthenticated()) {
                return Prosumer.findOne({ name: req.user.username }).sort({ timestamp: -1 });
            }
        }
    }
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
            return prosumer.save();
        }
    },
    updateFillBatteryRatio: {
        type: GraphQLBoolean,
        args: {
            fillBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            const filter = { name: req.session.username };
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
            useBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            const filter = { name: req.session.username };
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
            production: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            const filter = { name: req.session.username };
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
            consumption: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            const filter = { name: req.session.username };
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
