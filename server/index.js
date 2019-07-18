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
            // console.log('createNewNote', JSON.parse(data))
            if ( data != []) {
                try {

                } catch (e) {
                    console.error(e.message)
                }
                return [JSON.parse(data)]
            }
        },
        updateNote: async (_, {data}) => {  
            let notes = JSON.parse(data)
            if(notes.length != 0) {
            
                let updateLibrary = '',
                    updateData = '',
                    updateValue = '';
                // for(let note of notes) {
                //     updateLibrary += `UPDATE library SET name = ${JSON.stringify(note.name)}, link = ${JSON.stringify(note.link)} WHERE id = ${note.id};`
                    
                //     for(let i in note.data) {
                //         updateData += `UPDATE data SET value = ${note.data[i]} WHERE library_id = ${note.id};`
                //     }
                //     updateValue += `UPDATE value v1 JOIN value v2 ON v1.library_id = ${note.id} AND v2.library_id = ${note.id} SET v1.value = ${note.val1} v2.value = ${note.val2};`
                //     // updateValue += `UPDATE value SET value = ${note.val1} WHERE library_id = ${note.id}`
                // }
                // console.log('!!!',updateLibrary)
                // console.log('!!!!!!',updateData)
                // console.log('!!!!!!!!!!!',updateValue)
                //let query = updateLibrary + updateData + updateValue
                try {
                    for(let note of notes) {
                        updateLibrary = `UPDATE library SET name = ${JSON.stringify(note.name)}, link = ${JSON.stringify(note.link)} WHERE id = ${note.id};`
                        await connect.execute(`${updateLibrary}`);

                        for(let i in note.data) {
                            updateData = `INSERT INTO data SET value = ${note.data[i]}, `
                            await connect.execute(`${updateData}`);
                        }
                        updateValue = `UPDATE value v1 JOIN value v2 ON v1.library_id = ${note.id} AND v2.library_id = ${note.id} SET v1.value = ${note.val1} v2.value = ${note.val2};`
                        await connect.execute(`${updateValue}`);
                    }
                    //await connect.execute(query);
                    // await connect.execute(`${updateLibrary}`);
                    // await connect.execute(`${updateData}`);
                    // await connect.execute(`${updateValue}`);
                } catch (e) {
                    console.error(e.message)
                }
                return [JSON.parse(data)]; 
            }         
        },
        deleteNote: async (_, {data}) => {
            let d = JSON.parse(data)
            if (d.length != 0) {
                let noteId = d.map(e => JSON.parse(e))        
                try {
                    await connect.execute(`DELETE FROM library WHERE id in (${noteId})`);
                } catch (e) {
                    console.error(e.message)
                }
                return [JSON.parse(data)];
            }   
        }
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