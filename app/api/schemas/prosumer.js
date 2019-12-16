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
        market: { type: GraphQLString },
        timestamp: { type: GraphQLDateTime },
        consumption: { type: GraphQLFloat },
        production: { type: GraphQLFloat },        
        currBatteryCap: { type: GraphQLFloat },
        maxBatteryCap: { type: GraphQLFloat },
        fillBatteryRatio: { type: GraphQLFloat },
        useBatteryRatio: { type: GraphQLFloat },
        bought: { type: GraphQLFloat },
        blackout: { type: GraphQLFloat },
        turbineStatus: { type: GraphQLString },
        turbineWorking: { type: GraphQLBoolean} ,
        turbineBreakPercent: { type: GraphQLFloat }
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
                timestamp: Date.now(),
                consumption: 0,
                production: 0,
                currBatteryCap: 0,
                maxBatteryCap: args.maxBatteryCap,
                fillBatteryRatio: 0,
                useBatteryRatio: 0,
                bought: 0,
                turbineStatus: 'WORKING!',
                turbineWorking: true,
                turbineBreakPercent: 0.05 
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
                        timestamp: Date.now(),
                        cosnumption: doc.consumption,
                        production: doc.production,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: args.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        bought: doc.bought,
                        turbineStatus: doc.turbineStatus,
                        turbineWorking: doc.turbineWorking,
                        turbineBreakPercent: doc.turbineBreakPercent
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
                        timestamp: Date.now(),
                        consumption: doc.consumption,
                        production: doc.production,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: args.useBatteryRatio,
                        bought: doc.bought,
                        turbineStatus: doc.turbineStatus,
                        turbineWorking: doc.turbineWorking,
                        turbineBreakPercent: doc.turbineBreakPercent                        
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
                        timestamp: Date.now(),
                        consumption: doc.consumption,
                        production: args.production,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        bought: doc.bought,
                        turbineStatus: doc.turbineStatus,
                        turbineWorking: doc.turbineWorking,
                        turbineBreakPercent: doc.turbineBreakPercent
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
                        timestamp: Date.now(),
                        consumption: args.consumption,
                        production: doc.production,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        bought: doc.bought,
                        turbineStatus: doc.turbineStatus,
                        turbineWorking: doc.turbineWorking,
                        turbineBreakPercent: doc.turbineBreakPercent                        
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
