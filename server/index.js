const { GraphQLServer } = require('graphql-yoga');
const fetch = require('node-fetch');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
});

const db = require('./modules/db')
const createDate = require('./modules/date');
const restructJSON = require('./modules/restructJSON');
const getDataByParametr = require('./modules/getDataByParametr');

const Query = require('./graphql/resolvers/Query');
const Mutation = require('./graphql/resolvers/Mutation');

const resolvers = {
    Query,
    Mutation,
    Library:{
        children:(parent, args) => {
            return parent.children 
        }
    },
    dataSource: {
        getSalary: async (parent, {salary}) => {
            try {
                // let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent}); // !!!!!
                let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=company,sex,platform,byAge&date=${createDate(6)}`, {agent});
                let data = await response.json();
                let restructData = restructJSON(data);
                let findData = getDataByParametr(restructData, salary);
                return findData
            } catch (e) {
                console.log(e.message);
            }
        }
    }
}
const server = new GraphQLServer({
    typeDefs: './server/graphql/schema.graphql',
    resolvers,
    context:{
        connect: db
    } 
})
server.start(() => console.log(`Server is running on http://localhost:4000`))