const { GraphQLServer } = require('graphql-yoga');
const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
});

const createDate = require('./modules/date');
const restructJSON = require('./modules/restructJSON');
const getDataByParametr = require('./modules/getDataByParametr');

let connect
async function mysqlDb () {
     connect = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "dcharts",
        password: "450979",
        multipleStatements: true
    });
}
mysqlDb();

const resolvers = {
    Query:{
        getLibrary: async () => { 
            try {
                const [rows] = await connect.execute(`
                    SELECT 
                        library.id,
                        library.name,
                        library.link,
                        CONCAT(v1.value, ',', v1.label) AS val1,
                        CONCAT(v2.value, ',', v2.label) AS val2,
                        GROUP_CONCAT(data.value,'') AS data,
                        GROUP_CONCAT(data.label,'') AS labels
                    FROM library
                    LEFT JOIN value v1 ON v1.library_id = library.id AND v1.label = 'min'
                    LEFT JOIN value v2 ON v2.library_id = library.id AND v2.label = 'max'
                    LEFT JOIN data ON data.library_id = library.id
                    GROUP BY library.id
                `);
                let data = []
                for(let o of rows) {
                    data.push({
                        id: o.id,
                        name: o.name,
                        data: o.data.split(','),
                        labels: o.labels ? o.labels.split(',') : [],
                        val1:{
                            value: o.val1.split(',')[0],
                            label: o.val1.split(',')[1]
                        },
                        val2: {
                            value: o.val2.split(',')[0],
                            label: o.val2.split(',')[1]
                        },
                        link: o.link
                    })
                }
                // console.log(data)
                return data;
            } catch (e) {
                console.error(e.message);
            }
        },
        getDataByParametr: async (_,{parametr}) => {
            try {
                // let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent}); // !!!!!
                let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=company,sex,platform,byAge&date=${createDate(12)}`, {agent});
                let data = await response.json();
                let restructData = restructJSON(data);

                return getDataByParametr(restructData, parametr);
                // console.log(restructData);
            } catch (e) {
                console.log(e.message);
            }
        }
    },
    Mutation: {
        createNewNote: async (_, {data}) => {
            console.log('createNewNote', data)
            let notes = data,
                libraryArr = [],
                dataArr = [],
                valueArr = []

            if (notes.length != 0) {
                try {
                    for(let note of notes) {
                        libraryArr.push([JSON.parse(note.id),note.name, note.link]);
                        for(let i = 0; i < note.data.length; i++) {
                            dataArr.push([JSON.parse(note.id), note.data[i]]);
                        }
                        valueArr.push([JSON.parse(note.id), note.val1.value, note.val1.label]);
                        valueArr.push([JSON.parse(note.id), note.val2.value, note.val2.label]);
                    }
                    // console.log('libraryArr',libraryArr)
                    // console.log('dataArr',dataArr)
                    // console.log('valueArr',valueArr)

                    await connect.query(`INSERT INTO library (id, name, link) VALUES ?`, [libraryArr]);
                    await connect.query(`INSERT INTO data (library_id, value) VALUES ?`, [dataArr]);
                    await connect.query(`INSERT INTO value (library_id, value, label) VALUES ?`, [valueArr]);

                } catch (e) {
                    console.error(e.message)
                }
                // return [data.id]
            }
        },
        updateNote: async (_, {data}) => {
            let notes = data;
            let dataArray = []
            if(notes.length != 0) { 
                try {
                    for(let note of notes) {
                        await connect.execute(`UPDATE library SET name = ${JSON.stringify(note.name)}, link = ${JSON.stringify(note.link)} WHERE id = ${note.id};`);

                        for(let i = 0; i < note.data.length; i++) {
                            dataArray.push([JSON.parse(note.id), note.data[i]]);
                        }

                        await connect.execute(`DELETE FROM data WHERE library_id = ${note.id}`);
                        await connect.query(`INSERT INTO data (library_id, value) VALUES ?`, [dataArray]);
                        await connect.execute(`UPDATE value SET value = ${note.val1.value} WHERE library_id = ${note.id} AND label = '${note.val1.label}'`);
                        await connect.execute(`UPDATE value SET value = ${note.val2.value} WHERE library_id = ${note.id} AND label = '${note.val2.label}'`);
                    }
                } catch (e) {
                    console.error(e.message)
                }

                // return [data.id] 
            }         
        },
        deleteNote: async (_, {data}) => {
            if (data.length != 0) {
                let noteId = data.map(e => JSON.parse(e))        
                try {
                    await connect.execute(`DELETE FROM library WHERE id in (${noteId})`);
                } catch (e) {
                    console.error(e.message)
                }
                //return [data.id]
            }   
        }
    },
    Library:{
        children:(parent, args) => {
            console.log('children')
            console.log('Parent',parent)
        }
    }
}
const server = new GraphQLServer({
    typeDefs: './server/graphql/schema.graphql',
    resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))