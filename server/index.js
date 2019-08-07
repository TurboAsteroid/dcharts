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

    Librarys: {
        dataSets: async (parent, args, {connect}) => {
            try {
                const [dataSetLib] = await connect.execute(`
                    SELECT
                        libDS.id,
                        libDS.name,
                        CONCAT(control1.value, ',', control1.label) AS val1,
                        CONCAT(control2.value, ',', control2.label) AS val2,
                        GROUP_CONCAT(data.value,'') AS data,
                        GROUP_CONCAT(data.label,'') AS labels
                    FROM dataset_library libDS
                    LEFT JOIN control_values_datasets control1 
                        ON control1.dataset_id = libDS.id
                        AND control1.label = 'min'
                    LEFT JOIN control_values_datasets control2 
                        ON control2.dataset_id = libDS.id
                        AND control2.label = 'max'
                    LEFT JOIN dataset_values data
                        ON data.dataset_id = libDS.id
                    WHERE libDS.library_id = ${parent.id}
                    GROUP BY libDS.id
                `);
                let data = []
                for(let o of dataSetLib) {
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
                        });
                    }
                }
                return data;
            } catch(e) {
                console.log(e.message)
            }
        }
    },
/////////////////////////////////////
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