const { GraphQLServer } = require('graphql-yoga');

const db = require('./modules/db')
const Query = require('./graphql/resolvers/Query');
const Mutation = require('./graphql/resolvers/Mutation');
const Librarys = require('./graphql/resolvers/Librarys');
const DataSet = require('./graphql/resolvers/DataSet');


const resolvers = {
    Query,
    Mutation,
    Librarys,
    DataSet
};

const server = new GraphQLServer({
    typeDefs: './server/graphql/schema.graphql',
    resolvers,
    context:{
        connect: db
    } 
})
server.start(() => console.log(`Server is running on http://10.1.100.170:4000`));