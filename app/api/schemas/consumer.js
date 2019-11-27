const graphql = require('graphql');
const Consumer = require('../../model/consumer');
const graphqlIsoDate = require('graphql-iso-date');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, 
    GraphQLInt, GraphQLFloat, GraphQLNonNull 
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const ConsumerType = new GraphQLObjectType({
    name: 'Consumer',
    description: 'Consumer type definition.',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        market: { type: GraphQLString },
        timestamp: { type: GraphQLDateTime }, 
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
    consumers: {
        type: new GraphQLList(ConsumerType),
        resolve(parent, args) {
            return Consumer.find({});
        }
    }
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
    updateConsumerConsumption: {
        type: ConsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            consumption: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve(parent, args) {
            let filter = {name: args.name};
            let data = Consumer.findOne(filter).exec();
            data.then(function(doc){
                let consumer = new Consumer({
                    name: doc.name,
                    consumption: args.consumption,
                });
                consumer.save();
            });
        }
    },

};

module.exports = {ConsumerType, ConsumerQueries, ConsumerMutations};

