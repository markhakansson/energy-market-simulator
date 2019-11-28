const graphql = require('graphql');
const Consumer = require('../../db/model/consumer');
const graphqlIsoDate = require('graphql-iso-date');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, 
    GraphQLInt, GraphQLFloat, GraphQLNonNull, GraphQLBoolean, 
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
        consumption: { type: GraphQLFloat },
        bought: { type: GraphQLFloat },
        blackout: { type: GraphQLBoolean},
    })
});

const ConsumerQueries = {
    consumer: {
        type: ConsumerType,
        args: { name: { type: GraphQLString } },
        resolve(parent, args) {
            return Consumer.findOne({name: args.name}).sort({timestamp: -1});
        }
    },
    consumers: {
        type: new GraphQLList(ConsumerType),
        resolve(parent, args) {
            return Consumer.find().sort({timestamp: -1});
        }
    }
}

const ConsumerMutations = {
    addConsumer: {
        type: ConsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString)},
            market: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parent, args) {
            let consumer = new Consumer({
                name: args.name,
                market: args.market,
                consumption: 0,
                bought: 0,
                blackout: false,
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
            let data = Consumer.findOne(filter).sort({timestamp: -1}).exec();
            data.then(
                function(doc){
                    let consumer = new Consumer({
                        name: doc.name,
                        market: doc.market,
                        consumption: args.consumption,
                        bought: doc.bought,
                        blackout: doc.blackout,
                    });
                    consumer.save();
                },
                function(err){
                    console.error(err);
                }
            );
        }
    },

};

module.exports = {ConsumerType, ConsumerQueries, ConsumerMutations};

