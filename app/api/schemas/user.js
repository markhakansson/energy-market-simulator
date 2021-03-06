const graphql = require('graphql');
const User = require('../../db/model/user');
const Consumer = require('../../db/model/consumer');
const Prosumer = require('../../db/model/prosumer');
const Market = require('../../db/model/market');
const init = require('../../sim/controller/main').init;

const { ConsumerType } = require('../../api/schemas/consumer');
const { ProsumerType } = require('../../api/schemas/prosumer');
const { MarketType } = require('../../api/schemas/market');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        role: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLString }

    })
});
const UserQueries = {
    image: {
        type: GraphQLString,
        async resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            const user = await User.findOne({ username: req.session.user });
            if (!user) {
                return 'Failed to get user image';
            }
            return user.image;
        }
    },
    users: {
        type: new GraphQLList(UserType),
        async resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if (!req.session.manager) return 'Not authorized!';

            // all users
            // const users = await User.find({}, { username: 1, _id: 0 }); 

            // only prosumers
            return User.aggregate([ { $match: { manager: false } }, { $project: { _id: 0, username: 1 } } ]);
        }
    }
};

const UserMutations = {
    login: {
        type: GraphQLBoolean,
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve (parent, args, req) {
            const user = await User.findOne({ username: args.username });
            if (!user) {
                return false;
            }
            if (user.comparePassword(args.password)) {
                req.session.user = user.username;
                req.session.manager = user.manager;
                return true;
            }
            return false;
        }

    },

    signUp: {
        type: GraphQLBoolean,
        args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve (parent, args, req) {
            const user = await User.findOne({ username: args.username });
            if (!user) {
                const user = new User({
                    username: args.username,
                    password: args.password

                });
                await user.save();

                const prosumer = new Prosumer({
                    name: user.username,
                    market: 'none'
                });
                await prosumer.save();
                await init.call();
                return true;
            }
            return false;
        }
    },

    uploadImg: {
        type: GraphQLString,
        args: {
            image: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            const user = await User.findOne({ username: req.session.user });
            if (!user) {
                return 'Image failed to upload!';
            }
            user.image = args.image;
            user.save();
            return 'Image uploaded!';
        }
    },
    updatePassword: {
        type: GraphQLString,
        args: {
            oldPassword: { type: new GraphQLNonNull(GraphQLString) },
            newPassword: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';

            const user = await User.findOne({ username: req.session.user });
            if (!user) {
                return 'Password failed to update!';
            }
            if (user.comparePassword(args.oldPassword)) {
                user.password = args.newPassword;
                user.save();
                return 'Password updated!'
            }
            return 'Password failed to update!';
        }
    },
    deleteMe: {
        type: GraphQLBoolean,
        args: {
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            const user = await User.findOne({ username: req.session.user });
            if (!user || user.manager) {
                return false;
            }
            if (user.comparePassword(args.password)) {
                user.deleteOne();
                Prosumer.deleteMany({ name: req.session.user }).exec(); // Delete both user doc in users collection aswell as any prosumer docs!!
                return true;
            }
            return false;
        }
    },
    deleteProsumer: {
        type: GraphQLBoolean,
        args: {
            prosumer: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve (parent, args, req) {
            if (!req.session.user) return 'Not authenticated!';
            if(!req.session.manager) return 'Not authorized!';
            const user = await User.findOne({ username: args.prosumer });
            if (!user || user.manager) {
                return false;
            }
            user.deleteOne();
            Prosumer.deleteMany({ name: args.prosumer }).exec();
            return true;
        }
    }
};

module.exports = { UserType, UserQueries, UserMutations };
