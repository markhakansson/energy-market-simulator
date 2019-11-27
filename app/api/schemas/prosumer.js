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
        comsumption: { type: GraphQLFloat },
        timestamp: { type: GraphQLDateTime },
        production: { type: GraphQLFloat },
        battery: { type: GraphQLFloat },
        fillBatteryRatio: { type: GraphQLFloat },
        useBatteryRatio: { type: GraphQLFloat },
    })
});

const ProsumerQueries = {
    prosumer: {
        type: ProsumerType,
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Prosumer.findOne(args.name);
        }
    },
};

const ProsumerMutations = {
    addProsumer: {
        type: ProsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            battery: { type: new GraphQLNonNull(GraphQLInt) }, 
        },
        resolve(parent, args) {
            let prosumer = new Prosumer({
                name: args.name,
                consumption: 0,
                battery: args.battery,
                sell_market: args.sell_market,
                buy_market: args.buy_market
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
            let data = Prosumer.findOne(filter).exec();
            data.then(function(doc){
                let prosumer = new Prosumer({
                    name: doc.name,
                    fillBatteryRatio: args.fillBatteryRatio,
                });
                prosumer.save();
            });
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
            let data = Prosumer.findOne(filter).exec();
            data.then(function(doc){
                let prosumer = new Prosumer({
                    name: doc.name,
                    useBatteryRatio: args.useBatteryRatio,
                });
                prosumer.save();
            });
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
            let data = Prosumer.findOne(filter).exec();
            data.then(function(doc){
                let prosumer = new Prosumer({
                    name: doc.name,
                    production: args.production,
                });
                prosumer.save();
            });
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
            let data = Prosumer.findOne(filter).exec();
            data.then(function(doc){
                let prosumer = new Prosumer({
                    name: doc.name,
                    consumption: args.consumption,
                });
                prosumer.save();
            });
        }
    }
};

module.exports = {ProsumerType, ProsumerQueries, ProsumerMutations};
