const graphql = require('graphql');
const Prosumer = require('../../model/prosumer');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
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
        
        prosumer: {
        type: ProsumerType,
        resolve(parent, args) {
            return Prosumer.findById(parent.id);
        }
    }
    })
});

module.exports = ProsumerType;
