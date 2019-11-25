const graphql = require('graphql');

const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLFloat, GraphQLSchema, 
    GraphQLList,GraphQLNonNull 
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        consumer: {
            type: ConsumerType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Consumer.findById(args.id);
            }
        },
        consumer: {
            type: ConsumerType,
            args: {name: { type: GraphQLString} },
            resolve(_, args) {
                return Consumer.find(args.name);
            }
        },
        market: {
            type: MarketType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Market.findById(args.id);
            }
        },
        markets: {
            type: new GraphQLList(MarketType),
            resolve(parent, args) {
                return Market.find({});
            }
        },
        price: {
            type: GraphQLFloat,
            args: { id: { type: GraphQLID} },
            resolve(parent, args) {
                return Market.findById(args.id).price;
            }
        },
        prosumer: {
            type: ProsumerType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Prosumer.findById(args.id);
            }
        },
        weather: {
            type: WeatherType,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Weather.findById(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: RootQuery });