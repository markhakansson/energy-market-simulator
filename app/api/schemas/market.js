const graphql = require('graphql');
const Market = require('./model/market');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;



const MarketType = new GraphQLObjectType({
    name: 'Market',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        timestamp: { type: GraphQLInt },
        price: { type: GraphQLFloat },
        battery: { type: GraphQLInt },
        consumption: { type: GraphQLInt },
        demand: { type: GraphQLInt },
        
        market: {
        type: MarketType,
        resolve(parent,args){
            return Market.findById(parent.id);
        }
    }
        
    })
});
