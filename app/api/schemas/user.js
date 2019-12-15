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
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLSchema,
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
}

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
  }
};

module.exports = { UserType, UserQueries, UserMutations };

 