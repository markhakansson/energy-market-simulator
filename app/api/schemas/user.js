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
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    consumer: {
      type: new GraphQLList(ConsumerType),
      resolve(parent, args) {
        return Consumer.find( { name: parent.username } );
      }
    },
    prosumer: {
      type: new GraphQLList(ProsumerType),
      resolve(parent, args) {
        return Prosumer.find( { name: parent.username } );
      }
    },
    market: {
      type: new GraphQLList(MarketType),
      resolve(parent, args) {
        return Market.find( { name: parent.username });
      }
    }
  })
});



const UserMutations = {
  loginUser: {
    type: GraphQLBoolean,
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, req) {
      User.findOne( { username: args.username }, function(err, user) {
        if (err) throw err;

        if(!user) {
          throw new Error('Could not find user: ' + args.username);
        } 
        user.comparePassword(args.password, function(err, isMatch) {
          if(err) throw new Error('Incorrect password for user: ' + args.username);

          if(isMatch) {
            req.login(user, error => (error ? error : user));
            return true;
          }

        });
      });
    }
  }
};

module.exports = { UserType, UserMutations };

 