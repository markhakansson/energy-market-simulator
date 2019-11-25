const graphql = require('graphql');
const Consumer = require('./model/consumer');


const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;



const ConsumerType = new GraphQLObjectType({
    name: 'Consumer',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt }, 
        consumption: { type: GraphQLInt },
        
        consumer: {
        type: ConsumerType,
        resolve(parent, args) {
            return Consumer.findById(parent.id);
        }
    }
    })
});
