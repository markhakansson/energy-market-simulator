const graphql = require('graphql');
const Prosumer = require('../../db/model/prosumer');
const graphqlIsoDate = require('graphql-iso-date');
const errorMsg = require('./errors');
const Logger = require('../../config/logger');

const {
    GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList,
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
        blackout: { type: GraphQLBoolean },
        turbineStatus: { type: GraphQLString },
        turbineWorking: { type: GraphQLBoolean },
        turbineBreakPercent: { type: GraphQLFloat },
        blocked: { type: GraphQLBoolean },
        blockedTimer: { type: GraphQLFloat }
    })
});

const ProsumerQueries = {
    adminProsumer: {
        type: ProsumerType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            return Prosumer.findOne({ name: args.name }).sort({ timestamp: -1 });
        }
    },
    prosumer: {
        type: ProsumerType,
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            return Prosumer.findOne({ name: req.session.user }).sort({ timestamp: -1 });
        }

    },
    prosumers: {
        type: new GraphQLList(ProsumerType),
        async resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            let names = [];
            const prosumers = [];

            await Prosumer.distinct('name')
                .then(res => {
                    names = res;
                })
                .catch(err => {
                    Logger.error(err);
                });

            for (const name of names) {
                prosumers.push(await Prosumer.findOne({ name: name }).sort({ timestamp: -1 }));
            }

            return prosumers;
        }
    },
    // Returns name, timestamp and blackout for each prosumer. Timestamp to assure query is correct. _id is must exist.
    isBlocked: {
        type: new GraphQLList(ProsumerType),
        async resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            let prosumerNames = [];
            const prosumers = [];

            await Prosumer.distinct('name')
                .then(res => {
                    prosumerNames = res;
                })
                .catch(err => {
                    Logger.error(err);
                });

            for (const name of prosumerNames) {
                const prosumer = await Prosumer.findOne({ name: name }).sort({ timestamp: -1 });

                if (prosumer.blackout === true) {
                    prosumers.push(prosumer);
                }
            }

            return prosumers;

            // return Prosumer.aggregate([{ $sort: { name: 1, timestamp: 1 } }, { $group: { _id: '$name', name: { $last: '$name' }, timestamp: { $last: '$timestamp' }, blackout: { $last: '$blackout' } } }]);
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
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

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
                turbineBreakPercent: 0.05,
                blocked: false,
                blockedTimer: 0.0
            });
            return prosumer.save();
        }
    },
    blockProsumer: {
        type: GraphQLString,
        args: {
            prosumerName: { type: new GraphQLNonNull(GraphQLString) },
            timeout: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            const data = Prosumer.findOne({ name: args.prosumerName }).sort({ timestamp: -1 }).exec();
            return data.then(
                doc => {
                    // If already blocked don't do anything
                    if (doc.blocked) {
                        return 'Already blocked!';
                    } else {
                        const prosumer = new Prosumer({
                            name: doc.name,
                            market: doc.market,
                            timestamp: Date.now(),
                            consumption: doc.consumption,
                            production: doc.production,
                            currBatteryCap: doc.currBatteryCap,
                            maxBatteryCap: doc.maxBatteryCap,
                            fillBatteryRatio: args.fillBatteryRatio,
                            useBatteryRatio: doc.useBatteryRatio,
                            bought: doc.bought,
                            turbineStatus: doc.turbineStatus,
                            turbineWorking: doc.turbineWorking,
                            turbineBreakPercent: doc.turbineBreakPercent,
                            blocked: true,
                            blockedTimer: args.timeout
                        });
                        return prosumer.save().then(
                            res => { return 'Blocked'; },
                            err => {
                                Logger.error('API ´blockProsumer´: ' + err);
                                throw new Error(err);
                            }
                        );
                    }
                },
                err => {
                    Logger.error('API ´blockProsumer´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
                }
            )
        }
    },
    updateFillBatteryRatio: {
        type: GraphQLBoolean,
        args: {
            fillBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            const filter = { name: req.session.user };
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
                        fillBatteryRatio: args.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                        bought: doc.bought,
                        turbineStatus: doc.turbineStatus,
                        turbineWorking: doc.turbineWorking,
                        turbineBreakPercent: doc.turbineBreakPercent,
                        blocked: doc.blocked,
                        blockedTimer: doc.blockedTimer
                    });
                    return prosumer.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´updateFillBatteryRatio´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´updateFillBatteryRatio´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            const filter = { name: req.session.user };
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
                        turbineBreakPercent: doc.turbineBreakPercent,
                        blocked: doc.blocked,
                        blockedTimer: doc.blockedTimer
                    });
                    return prosumer.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´updateUseBatteryRatio´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´updateUseBatteryRatio´: ' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            const filter = { name: req.session.user };
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
                        turbineBreakPercent: doc.turbineBreakPercent,
                        blocked: doc.blocked,
                        blockedTimer: doc.blockedTimer
                    });
                    return prosumer.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´updateProsumerProduction´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´updateProsumerProduction´:' + err);
                    throw new Error('Could not save document to database: ' + err);
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
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);

            const filter = { name: req.session.user };
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
                        turbineBreakPercent: doc.turbineBreakPercent,
                        blocked: doc.blocked,
                        blockedTimer: doc.blockedTimer
                    });
                    return prosumer.save().then(
                        res => { return true; },
                        err => {
                            Logger.error('API ´updateProsumerConsumption´: ' + err);
                            throw new Error(err);
                        }
                    );
                },
                err => {
                    Logger.error('API ´updateProsumerConsumption´:' + err);
                    throw new Error('Could not save document to database: ' + err);
                }
            );
        }
    }
};

module.exports = { ProsumerType, ProsumerQueries, ProsumerMutations };
