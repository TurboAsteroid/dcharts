const { GraphQLServer } = require('graphql-yoga')
const mysql = require('mysql2/promise');
const createDate = require('./modules/date');
const fetch = require('node-fetch');

let connect
async function mysqlDb () {
     connect = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "dcharts",
        password: "450979"
    });
}
mysqlDb();

const resolvers = {
    Query:{
        getLibrary: async () => {
            try {
                const [rows] = await connect.execute(`
                    SELECT library.id,library.name,library.link,
                    (SELECT GROUP_CONCAT(value,'') FROM value WHERE library_id = library.id) AS value, GROUP_CONCAT(data.value,'') AS data 
                    FROM library, data WHERE library.id = data.library_id GROUP BY data.library_id
                `);
                // const [rows] = await connect.execute(`
                //     SELECT library.id, library.name, library.link, value.value, (SELECT GROUP_CONCAT(data.value,'') 
                //     FROM data WHERE library.id = data.library_id GROUP BY data.library_id) AS data
                //     FROM library LEFT JOIN value ON library.id = value.library_id
                // `);
                
                let data = []
                for(let o of rows) {
                    data.push({
                        id: o.id,
                        name: o.name,
                        data: o.data.split(','),
                        val1: o.value.split(',')[0],
                        val2: o.value.split(',')[1],
                        link: o.link
                    })
                }
                return data;
            } catch (e) {
                console.error(e.message);
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
    },
    Mutation: {
        createNewNote: async (_, {data}) => {
            console.log('createNewNote', JSON.parse(data))
            try {

            } catch (e) {
                console.error(e.message)
            }
            return [JSON.parse(data)]
        },
        updateNote: async (_, {data}) => {
            console.log('updateNote', JSON.parse(data))
            try {
                
            } catch (e) {
                console.error(e.message)
            }
            return [JSON.parse(data)];
        },
        deleteNote: async (_, {data}) => {
            let noteId = JSON.parse(data).map(e => JSON.parse(e))
            console.log(noteId)
            try {
                await connect.execute(`DELETE FROM library WHERE id in (${noteId})`);
            } catch (e) {
                console.error(e.message)
            }
            return [JSON.parse(data)];
        }
        // changeDatabase: async (_, {data}) => {
        //     console.log(JSON.parse(data))
        //     // return {data}
        // }
    },
    Library:{
        children:() => {
            console.log('children')
        }
    }
}
const server = new GraphQLServer({
    typeDefs: './server/graphql/schema.graphql',
    resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))