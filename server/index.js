const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
// const fsPromise = require('fs-readfile-promise');
const fetch = require('node-fetch');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
})
const mysql = require('mysql2/promise');
//const bodyParser = require('body-parser');
// const urlencodedParser = bodyParser.urlencoded({extended: false});

let connect
async function mysqlDb () {
     connect = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "dcharts_salary",
        password: "450979"
    });
}
mysqlDb();


const createDate = require('./modules/date.js');
//const getData = require('./modules/dataParametrs');

const schema = buildSchema(`
    type Query {
        getLibrary: [Library]
        getDataByParametr(parametr: String!): [DataParametrs]
    }
    type Library {
        id: ID!
        data: [String]
        name: String
        value: [String]
        link: String
    }
    type DataParametrs {
        id: String!
        data: [String]
        label: [String]
    } 
`)
const rootValue = {
    getLibrary: async() => {
        try {
            const [rows] = await connect.execute(`
            SELECT library.id,library.name,library.link,
            (SELECT GROUP_CONCAT(value,'') FROM value WHERE library_id = library.id) AS value, GROUP_CONCAT(data.value,'') AS data 
            FROM library, data WHERE library.id = data.library_id GROUP BY data.library_id
            `);
            for(let o of rows) {
                o.data = o.data.split(',');
                o.value = o.value.split(',');
            }
            // console.log(rows)
            return rows;
        } catch (e) {
            console.log(e.message);
        }
    },
    getDataByParametr: async ({parametr}) => {
        try {
            let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent})
            let data = await response.json();
            
            //return getData(data, parametr)
            
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