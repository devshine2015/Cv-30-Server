const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const resolvers = require('./resolvers');
const typeDefs = require('./types');

// module.exports = makeExecutableSchema({
//     typeDefs,
//     resolvers,
// });
module.exports = {
    typeDefs,
    resolvers,
};