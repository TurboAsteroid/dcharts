const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const fsPromise = require('fs-readfile-promise');
const fetch = require('node-fetch');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
})

const createDate = require('./modules/date.js');

const schema = buildSchema(`
    type Query {
        getLibrary: [Library]
        getDataByParametr(parametr: String!): [DataParametrs]
    }
    type Library {
        id: ID!
        data: [Int]
        name: String
        val1: Int
        val2: Int
        link: String
    }
    type DataParametrs {
        
        data: [String]!
        label: [String]!
    }
`)
const rootValue = {
    getLibrary:async() => {
        try {
            let library = JSON.parse(await fsPromise('./server/library.json', 'utf8'));
            return library
        } catch (e) {
            console.log(e.message)
        }
    },
    getDataByParametr: async ({parametr}) => {
        try {
            console.log(parametr)
            let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate()}`, {agent})
            let data = await response.json();
            console.log(data);
            // return data
        } catch (e) {
            console.log(e.message)
        }
    }
}

const app = express()

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema, rootValue, graphiql: true
}))
app.listen(4000, () => console.log('Listening on 4000'));