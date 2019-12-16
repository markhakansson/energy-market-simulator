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
    role: { type: GraphQLNonNull(GraphQLString)},
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLString },
    
  })
});
const UserQueries = {
  image: {
    type: GraphQLString,
    async resolve(parent, args, req) {
      if(req.isAuthenticated()) {
        const user = await User.findOne( { username: req.user.username });
        if(!user) {
          return "Failed to get user image";
        }
        return user.image;
      }
    }
  }
};

const UserMutations = {

  uploadImg: {
    type: GraphQLString,
    args: {
      image: { type: new GraphQLNonNull(GraphQLString) }, 
    },
    async resolve(parent, args, req) {
      const user = await User.findOne( { username: req.user.username });
      if(!user) { 
        return "Image failed to upload!";       
      }
      user.image = args.image;
      user.save();
      return "Image uploaded!";
    }
  },
  updatePassword: {
    type: GraphQLString,
    args: {
      oldPassword: { type: new GraphQLNonNull(GraphQLString) },
      newPassword: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, req) {
      if(!req.isAuthenticated()) return "Not authenticated!";

      const user = await User.findOne( { username: req.user.username });
      if(!user) {
        return "Password failed to update!";
      }
      if(user.comparePassword(args.oldPassword)) {
        user.password = args.newPassword;
        user.save();
        return "Password updated!"
      }
      return "Password failed to update!";

    }
  },
  deleteAdmin: {
    type: GraphQLString,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, req) {
      if(!req.isAuthenticated()) return "Not authenticated!";

      if(user.username != args.username ) return "Are you the one you say you really are?";
      const user = await User.findOne( { username: req.user.username });
      if(!user) {
        return "Failed";
      }
      if(user.comparePassword(args.password)) {
        user.deleteOne();
        return "User deleted";
      }
      return "Failed to delete user";
    }
  }
};



module.exports = { UserType, UserQueries, UserMutations };

 
