const graphql = require('graphql');
const Prosumer = require('../../model/prosumer');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLNonNull 
} = graphql;

const ProsumerType = new GraphQLObjectType({
    name: 'Prosumer',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt }, 
        comsumption: { type: GraphQLInt },
        battery: { type: GraphQLInt },
        sell_market: { type: GraphQLInt },
        buy_market: { type: GraphQLInt },
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
            sell_market: { type: new GraphQLNonNull(GraphQLInt) },
            buy_market: { type: new GraphQLNonNull(GraphQLInt) },
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
};

module.exports = {ProsumerType, ProsumerQueries, ProsumerMutations};
