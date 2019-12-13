const graphql = require('graphql');
const User = require('../../db/model/user');
const Consumer = require('../../db/model/consumer');
const Prosumer = require('../../db/model/prosumer');
const Market = require('../../db/model/market');

const { ConsumerType } = require('../../api/schemas/consumer');
const { ProsumerType } = require('../../api/schemas/prosumer');
const { MarketType } = require('../../api/schemas/market');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        role: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }

    })
});

const UserMutations = {
    loginUser: {
        type: GraphQLBoolean,
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve (parent, args, req) {
            User.findOne({ username: args.username }, function (err, user) {
                // Removed to avoid throwing error with possible sensetive data, see OWASP
                // if (err) throw err;
                if (err) console.error(err);

                if (!user) {
                    throw new Error('Could not find user: ' + args.username);
                }
                user.comparePassword(args.password, function (err, isMatch) { // Avoiding to throw errors here
                    if (err) console.error(err);

                    if (!isMatch) throw new Error('Incorrect password for user: ' + args.username);

                    if (isMatch) {
                        req.login(user, error => (error || user)); // Passport login
                        console.log(args.username + ' is now logged in!');
                        return true;
                    }
                });
            });
        }
    }
};

module.exports = { UserType, UserMutations };
