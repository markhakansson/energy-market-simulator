const graphql = require('graphql');
const User = require('../../db/model/user');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, 
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User type definition.',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID)  },
        username: { type: GraphQLNonNull(GraphQLString) },
        apiKey: { type: GraphQLNonNull(GraphQLString) }
    })
});

const UserQueries = {
    user: {
        type: UserType,
        args: { name: { type: GraphQLString },
                password: { type: GraphQLString }
    },
        resolve(parent, args) {
            return User.findOne({name: args.name, password: args.password});
        }
    }
};

const UserMutations = {
    addUser: {
        type: UserType,
        args: {
            name: { type: new GraphQLNonNull(GraphQLString)},
            password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parent, args) {
            let user = new Consumer({
                name: args.name,
                password: args.password,
                timestamp: Date.now(),
            });
            return user.save();
        }
    }

};

module.exports = {UserType, UserQueries, UserMutations};

