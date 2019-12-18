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
    GraphQLBoolean,
    GraphQLList
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
      if(!req.isAuthenticated()) return "Not authenticated!";
      const user = await User.findOne( { username: req.user.username });
      if(!user) {
        return "Failed to get user image";
      }
      return user.image;
    
    }
  },
  users: {
    type: new GraphQLList(UserType),
    async resolve(parent, args, req) {
      if(!req.isAuthenticated()) return "Not authenticated!";
      const user = await User.findOne( { username: req.user.username });
      if (user.role == 'admin') {
        const users = await User.find({}, { username: 1, _id: 0 } );
        return users;
        
      }
      return "Not authorized!";
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
    async resolve(parent, args, req) {
      const user = await User.findOne( {username: args.username });
      if(!user) {
        return false;
      }
      if(user.comparePassword(args.password)) {
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
    async resolve(parent, args, req) {
      const user = await User.findOne({ username: args.username });
      if (!user) {
          const user = new User({
              username: args.username,
              password: args.password,

          });
          await user.save();
          return true;
      }
      return false;
    
    }
  },

  uploadImg: {
    type: GraphQLString,
    args: {
      image: { type: new GraphQLNonNull(GraphQLString) }, 
    },
    async resolve(parent, args, req) {
      if(!req.isAuthenticated()) return "Not authenticated!";
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
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, req) {
      if(!req.isAuthenticated()) return "Not authenticated!";
      const user = await User.findOne( { username: req.user.username });
      if(!user) {
        return "Failed";
      }
      if(user.comparePassword(args.password)) {
        user.deleteOne();
        return "User deleted!";
      }
      return "Failed to delete user!";
    }
  }
};



module.exports = { UserType, UserQueries, UserMutations };

 
