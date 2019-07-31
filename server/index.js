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
const createTree = require('./modules/createTree');
//const addDataToReport = require('./modules/addDataToReport');
const createLinkTree = require('./modules/createLinkTree');

let connect;
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
                // console.log(rows)
                let data = []
                for(let o of rows) {
                    if (o.id != 0) {
                        data.push({
                            id: o.id,
                            name: o.name,
                            data: o.data ? o.data.split(',').map(x => JSON.parse(x)) : [],
                            labels: o.labels ? o.labels.split(',') : [],
                            val1:{
                                value: o.val1 ? JSON.parse(o.val1.split(',')[0]) : 0,
                                label: o.val1 ? o.val1.split(',')[1] : ''
                            },
                            val2: {
                                value: o.val2 ? JSON.parse(o.val2.split(',')[0]) : 0,
                                label: o.val2 ? o.val2.split(',')[1] : ''
                            },
                            link: o.link
                        });
                    }  
                }
                return data;
            } catch (e) {
                console.error(e.message);
            }
        },
        getDataByParametr: async (_,{linkSelected}) => {
            try {
                // let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent}); // !!!!!
                let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=company,sex,platform,byAge&date=${createDate(6)}`, {agent});
                let data = await response.json();
                let restructData = restructJSON(data);
                
                return getDataByParametr(restructData, sortLinkSelected[0].linkParametr);
                
            } catch (e) {
                console.log(e.message);
            }
        },
        getTree: async () => {
            try {
                const [tree] = await connect.execute(`
                    SELECT * FROM library l
                    JOIN tree t ON l.id = t.id_note
                    ORDER BY parent_id
                `);
                const [lib] = await connect.execute(`
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
                
                let result = createTree(tree, lib);
                return result;
            } catch (e) {
                console.error(e.message);
            }
        },
        getData: async () => {
            return {}
        },
        getLibraryLink: async () => {
            try {
                const [libLink] = await connect.execute(`
                    SELECT * FROM link_salary
                    WHERE id != 0
                `);
                let result = createLinkTree(libLink);
                return JSON.stringify(result)
            } catch (e) {
                console.error(e.message);
            }
        },
        getLibraryTree: async () => {
            try {
                const [libTree] = await connect.execute(`
                    SELECT * FROM library_trees
                    WHERE id != 0
                `)
                //console.log(libTree)
                let result = []
                for(let o of Object.keys(libTree)) {
                    result.push({
                        id: libTree[o].id,
                        title: libTree[o].title,
                        date: libTree[o].date
                    })
                }
                return result;
            } catch (e) {
                console.error(e.message);
            }
        }
    },
    Mutation: {
        createNewNote: async (_, {data}) => {
            // console.log('createNewNote', data);
            let notes = data,
                libraryArr = [],
                dataArr = [],
                valueArr = [];

            if (notes.length != 0) {
                try {
                    for(let note of notes) {
                        libraryArr.push([JSON.parse(note.id),note.name, note.link]);
                        if(note.data.length) {
                            for(let i = 0; i < note.data.length; i++) {
                                dataArr.push([JSON.parse(note.id), note.data[i]]);
                            }
                        }
                        valueArr.push([JSON.parse(note.id), note.val1.value, note.val1.label], 
                                    [JSON.parse(note.id), note.val2.value, note.val2.label]);
                        // valueArr.push([JSON.parse(note.id), note.val2.value, note.val2.label]);
                    }
                    if(libraryArr.length) {
                        await connect.query(`INSERT INTO library (id, name, link) VALUES ?`, [libraryArr]);
                    }
                    if(dataArr.length) {
                        await connect.query(`INSERT INTO data (library_id, value) VALUES ?`, [dataArr]);
                    }
                    if(valueArr.length) {
                        await connect.query(`INSERT INTO value (library_id, value, label) VALUES ?`, [valueArr]);
                    }

                } catch (e) {
                    console.error(e.message);
                }
                // return [data.id]
            }
        },
        updateNote: async (_, {data}) => {
            let notes = data;
            let dataArray = [];
            if(notes.length != 0) { 
                try {
                    for(let note of notes) {
                        await connect.execute(`UPDATE library SET name = ${JSON.stringify(note.name)}, link = ${JSON.stringify(note.link)} WHERE id = ${note.id};`);

                        for(let i = 0; i < note.data.length; i++) {
                            dataArray.push([JSON.parse(note.id), note.data[i]]);
                        }
                        await connect.execute(`DELETE FROM data WHERE library_id = ${note.id}`);
                        
                        await connect.execute(`UPDATE value SET value = ${note.val1.value} WHERE library_id = ${note.id} AND label = '${note.val1.label}'`);
                        await connect.execute(`UPDATE value SET value = ${note.val2.value} WHERE library_id = ${note.id} AND label = '${note.val2.label}'`);
                    }
                    if(dataArray.length) {
                        await connect.query(`INSERT INTO data (library_id, value) VALUES ?`, [dataArray]);
                    }
                } catch (e) {
                    console.error(e.message);
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
        },
        changeTree: async (_, {tree}) => {
            await connect.execute(`DELETE FROM tree WHERE id_note != 0`);
            let res = [];
            (async function recurse(currentNode, parentId = 1) {
                for(let i = 0, length = currentNode.children.length; i < length; i++) { 
                    try {
                        if(parentId && parentId != 0) {
                            res = await connect.query(`INSERT INTO tree (id_note, parent_id) VALUES (${parseInt(currentNode.children[i].id)}, ${parentId})`)
                            recurse(currentNode.children[i], res[0].insertId);       
                        }
                    } catch (e) {
                        console.error(e.message);
                    }  
                }
            })(tree); 
        }
    },
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
})
server.start(() => console.log(`Server is running on http://localhost:4000`))