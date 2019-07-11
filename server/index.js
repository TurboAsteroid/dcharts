const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const fsPromise = require('fs-readfile-promise');

const schema = buildSchema(`
    type Query {
        getLibrary: [Library]
    }
    type Library {
        id: ID!
        data: [Int]
        name: String
        val1: Int
        val2: Int
        link: String
    }
`)
const rootValue = {
    getLibrary:async() => {
        let library = JSON.parse(await fsPromise('./server/library.json', 'utf8'));
        return library
    }
}

const app = express()

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema, rootValue, graphiql: true
}))
app.listen(4000, () => console.log('Listening on 4000'));