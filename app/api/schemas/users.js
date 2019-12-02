const graphql = require('graphql');
const { verifyJwt } = require('../../utils');
const PlaceType = require('./place');
const UserType = require('../../db/model/user');

const { 
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLInputObjectType
} = graphql;

const UsersType = new GraphQLObjectType({
    name: 'Users',
    fields: () => {
        return {
            username: { type: GraphQLNonNull(GraphQLString) },
            visitedPlaces: {
                type: new GraphQLList(PlaceType),
                resolve(parent, args, { req }) {
                    try {
                        verifyJwt(req);
                        return Users.find( { id: parent.id });
                    } catch (err) {
                        return [];
                    }
                }
                
                
            }
        }
    }
});

const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        username: { type: GraphQLNonNull(GraphQLString) }
    }
});


const addUser = {
    type: UserType,
    description: 'This mutation will create a new user and it will return a apiKey',
    args: {
        input: { type: new GraphQLNonNull(UserInputType) }
    },
    resolve(obj, { input }) {
        let newUser = new User({
            username: input.username,
            password: input.password
        });
        return newUser.save(); 
    }
}   



const getUser = {
    type: UsersType,
    description: 'This query will search for a user with userId',
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    resolve(obj, { id }, { req }) {
        return Users.find( { id: id });
    }
};

module.exports = { UsersType, addUser, getUser };