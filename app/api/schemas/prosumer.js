const graphql = require('graphql');
const Prosumer = require('../../model/prosumer');
const graphqlIsoDate = require('graphql-iso-date');

const { 
    GraphQLObjectType, GraphQLString, GraphQLFloat,
    GraphQLID, GraphQLInt, GraphQLNonNull 
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const ProsumerType = new GraphQLObjectType({
    name: 'Prosumer',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        market: { type: GraphQLString },
        currBatteryCap: { type: GraphQLFloat},
        comsumption: { type: GraphQLFloat },
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
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Prosumer.findOne({name: args.name}).sort({timestamp: -1});
        }
    },
};

const ProsumerMutations = {
    addProsumer: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            market: { type: new GraphQLNonNull(GraphQLString) },
            maxBatteryCap: { type: new GraphQLNonNull(GraphQLInt) }, 
        },
        resolve(parent, args) {
            let prosumer = new Prosumer({
                name: args.name,
                market: args.market,
                consumption: 0,
                production: 0,
                fillBatteryRatio: 0,
                useBatteryRatio: 0,
                currBatteryCap: 0,
                maxBatteryCap: args.maxBatteryCap,
            });
            return prosumer.save();
        }
    },
    updateFillBatteryRatio: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLFloat) },
            fillBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve(parent, args) {
            let filter = {name: args.name };
            let data = Prosumer.findOne(filter).sort({timestamp: -1}).exec();
            data.then(
                function(doc) {
                    let prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: args.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                    });
                    prosumer.save();
                },
                function(err) {
                    console.error(err);
                }
            );
        }
    },
    updateUseBatteryRatio: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLFloat) },
            useBatteryRatio: { type: new GraphQLNonNull(GraphQLFloat)},
        },
        resolve(parent, args) {
            let filter = {name: args.name };
            let data = Prosumer.findOne(filter).sort({timestamp: -1}).exec();
            data.then(
                function(doc) {
                    let prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: doc.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: args.useBatteryRatio,
                    });
                    prosumer.save();
                },
                function(err) {
                    console.error(err);
                }
            );
        }
    },
    updateProsumerProduction: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            production: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve(parent, args) {
            let filter = { name: args.name };
            let data = Prosumer.findOne(filter).sort({timestamp: -1}).exec();
            data.then(
                function(doc) {
                    let prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: args.production,
                        consumption: doc.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                    });
                    prosumer.save();
                },
                function(err){
                    console.error(err);
                }
            );
        }
    },
    updateProsumerConsumption: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            consumption: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve(parent, args) {
            let filter = { name: args.name };
            let data = Prosumer.findOne(filter).sort({timestamp: -1}).exec();
            data.then(
                function(doc) {
                    let prosumer = new Prosumer({
                        name: doc.name,
                        market: doc.market,
                        production: doc.production,
                        consumption: args.consumption,
                        currBatteryCap: doc.currBatteryCap,
                        maxBatteryCap: doc.maxBatteryCap,
                        fillBatteryRatio: doc.fillBatteryRatio,
                        useBatteryRatio: doc.useBatteryRatio,
                    });
                    prosumer.save();
                },
                function(err) {
                    console.error(err);
                }
            );
        }
    }
};

module.exports = {ProsumerType, ProsumerQueries, ProsumerMutations};