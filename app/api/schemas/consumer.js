const graphql = require('graphql');
const Consumer = require('../../model/consumer');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, 
    GraphQLInt, GraphQLFloat, GraphQLNonNull 
} = graphql;

const ConsumerType = new GraphQLObjectType({
    name: 'Consumer',
    description: 'Consumer type definition.',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt }, 
        consumption: { type: GraphQLInt },
    })
});

const ConsumerQueries = {
    consumer: {
        type: ConsumerType,
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Consumer.findOne({name: args.name});
        }
    },
}

const ConsumerMutations = {
    addConsumer: {
        type: ConsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString)},
            consumption: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve(parent, args) {
            let consumer = new Consumer({
                name: args.name,
                consumption: args.consumption
            });
            return consumer.save();
        }
    },
    updateConsumption: {
        type: ConsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            consumption: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve(parent, args) {
            let consumer = Consumer.findOne({name: args.name});
            consumer.consumption = args.consumption;
            consumer.save();
        }
    },

};

module.exports = {ConsumerType, ConsumerQueries, ConsumerMutations};

