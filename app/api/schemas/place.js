const graphql = require('graphql');
// const User = require('../../db/model/user');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, 
} = graphql;

const PlaceType = new GraphQLObjectType({
    name: 'Place',
    fields: () => {
        return {
            place: { type: GraphQLNonNull(GraphQLString)  },
        }
    }
});

module.exports = { PlaceType };