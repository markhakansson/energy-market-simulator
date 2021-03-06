const graphql = require('graphql');
const Consumer = require('../../db/model/consumer');
const graphqlIsoDate = require('graphql-iso-date');
const errorMsg = require('./errors');
const Logger = require('../../config/logger');

const {
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,
    GraphQLFloat, GraphQLNonNull, GraphQLBoolean
} = graphql;

const {
    GraphQLDateTime
} = graphqlIsoDate;

const ConsumerType = new GraphQLObjectType({
    name: 'Consumer',
    description: 'Consumer type definition.',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        market: { type: GraphQLString },
        timestamp: { type: GraphQLDateTime },
        consumption: { type: GraphQLFloat },
        bought: { type: GraphQLFloat },
        blackout: { type: GraphQLBoolean },
        retrying: { type: GraphQLBoolean },
        demand: { type: GraphQLFloat }
    })
});

const ConsumerQueries = {
    consumer: {
        type: ConsumerType,
        args: { name: { type: GraphQLString } },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            return Consumer.findOne({ name: args.name }).sort({ timestamp: -1 });
        }
    },
    consumers: {
        type: new GraphQLList(ConsumerType),
        async resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            let names = [];
            const consumers = [];

            await Consumer.distinct('name')
                .then(res => {
                    names = res;
                })
                .catch(err => {
                    Logger.error(err);
                });

            for (const name of names) {
                consumers.push(await Consumer.findOne({ name: name }).sort({ timestamp: -1 }));
            }

            return consumers;
        }
    }
}

const ConsumerMutations = {
    addConsumer: {
        type: ConsumerType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            market: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            const consumer = new Consumer({
                name: args.name,
                market: args.market,
                timestamp: Date.now(),
                consumption: 0,
                bought: 0,
                blackout: false,
                retrying: false,
                demand: 0
            });
            return consumer.save();
        }
    },
    updateConsumerConsumption: {
        type: GraphQLBoolean,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString) },
            consumption: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve (parent, args, req) {
            if (!req.session.user) throw new Error(errorMsg.notAuthenticated);
            if (!req.session.manager) throw new Error(errorMsg.notAuthorized);

            const filter = { name: args.name };
            const data = Consumer.findOne(filter).sort({ timestamp: -1 }).exec();
            return data.then(
                function (doc) {
                    const consumer = new Consumer({
                        name: doc.name,
                        market: doc.market,
                        timestamp: Date.now(),
                        consumption: args.consumption,
                        bought: doc.bought,
                        blackout: doc.blackout,
                        retrying: doc.retrying,
                        demand: doc.demand
                    });
                    consumer.save();
                    return true;
                },
                function (err) {
                    Logger.error(err);
                    throw new Error('Could not save document to database: ' + err);
                }
            );
        }
    }

};

module.exports = { ConsumerType, ConsumerQueries, ConsumerMutations };
