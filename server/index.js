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
const createTree = require('./modules/createTree');
const createStatus = require('./modules/createStatus');

const Query = require('./graphql/resolvers/Query');
const Mutation = require('./graphql/resolvers/Mutation');

const getDataForTree = async (parent, linkTree) => {
    let source  = parent.source,
        parametrs = [],
        result;

    linkTree.forEach(x => parametrs.push(x.link_name.split('.')[1]));
    try {
        // source === 'Salary' ? result = await getSalary(parametrs, source) : {};
        // source === 'Cu' ? result = await getCu(parametrs, source) : {};
        switch(source) {
            case 'Salary':
                result = await getSalary(parametrs, source)
                break;
            case 'Cu':
                result = await getCu(parametrs, source)
                break;
            default:
                result = null;
                break;
          }
        result ? linkTree.forEach(x => {
            x.data = result.filter(i => i.id === x.link_name).map(i => i.data)[0];
            x.labels = result.filter(i => i.id === x.link_name).map(i => i.labels)[0];
        }) : {};
        return linkTree;
    } catch (e) {
        console.log(e)
    }
};
const getSalary = async (parametrs, source) => {
    try {
        // let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent}); // !!!!!
        let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=company,sex,platform,byAge&date=${createDate(6)}`, {agent});
        let data = await response.json();
        let restructData = restructJSON(data); // промежеуточная функция преобразования данных из API
        let findData = getDataByParametr(restructData, parametrs, source);
        return findData;
    } catch (e) {
        console.log(e.message);
    }
};
const getCu = async (parametrs) => {
    // console.log('getCu')
};

const resolvers = {
    Query,
    Mutation,

    Librarys: {
        dataSets: async (parent, {addData}, {connect}) => {
            try {
                if(!parent.source) {
                    let dataSetLib;
                    [dataSetLib] = await connect.execute(`
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

                    let data = [];
                    for(let o of dataSetLib) {
                        if (o.id != 0) {
                            let idx = data.push({
                                id: o.id,
                                name: o.name,
                                data: o.data ? o.data.split(',').map(x => JSON.parse(x)) : [],
                                labels: o.labels ? o.labels.split(',') : [],
                                val1:{
                                    value: o.val1 ? JSON.parse(o.val1.split(',')[0]) : 0,
                                    label: o.val1 ? o.val1.split(',')[1] : 'min'
                                },
                                val2: {
                                    value: o.val2 ? JSON.parse(o.val2.split(',')[0]) : 0,
                                    label: o.val2 ? o.val2.split(',')[1] : 'max'
                                },
                            });
                            createStatus(data[idx - 1]);
                        }
                    }
                    if(parent.dataset_id) {
                        data.forEach(x => {
                            if(parent.dataset_id.some(i => i === x.id)) {
                                x.inTree = true;
                            } else {
                                x.inTree = false;
                            }
                        });
                        delete parent.dataset_id;
                        delete parent.link_id;
                    }
                    // console.log(data)
                    return data;
                } else if(parent.source) {
                    // console.log(parent)
                    let linkTree = []
                    if(!addData) {
                        [linkTree] = await connect.execute(`
                            SELECT
                                linklib.id,
                                linklib.name,
                                linklib.link_name,
                                linklib.parent_id,
                                CONCAT(control1.value, ',', control1.label) AS val1,
                                CONCAT(control2.value, ',', control2.label) AS val2
                            FROM link_library linklib
                            LEFT JOIN control_values_links control1 
                                ON control1.link_id = linklib.id
                                AND control1.label = 'min'
                            LEFT JOIN control_values_links control2 
                                ON control2.link_id = linklib.id
                                AND control2.label = 'max'
                            WHERE linklib.library_id = ${parent.id}
                            GROUP BY linklib.id
                        `);
                    } else if(addData && parent.link_id) {
                    // console.log('parent', parent)

                        for(let o of parent.link_id) {
                            let [obj] = await connect.execute(`
                                SELECT
                                    linklib.id,
                                    linklib.name,
                                    linklib.link_name,
                                    linklib.parent_id,
                                    CONCAT(control1.value, ',', control1.label) AS val1,
                                    CONCAT(control2.value, ',', control2.label) AS val2
                                FROM link_library linklib
                                LEFT JOIN control_values_links control1 
                                    ON control1.link_id = linklib.id
                                    AND control1.label = 'min'
                                LEFT JOIN control_values_links control2 
                                    ON control2.link_id = linklib.id
                                    AND control2.label = 'max'
                                WHERE linklib.library_id = ${parent.id}
                                    AND linklib.id = ${o}
                                GROUP BY linklib.id
                            `);
                            linkTree.push(...obj);
                        }
                        
                        linkTree = await getDataForTree(parent, linkTree);
                    }
                    
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
                    // console.log('linkTree', linkTree)
                    // console.log('dataSetLib', dataSetLib)
                    let result = createTree(linkTree, parent.link_id);
                    for(let o of dataSetLib) {
                        let idx = result.children.push({
                            id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                            datasetID: o.id,
                            name: o.name,
                            data: o.data ? o.data.split(',') : [],
                            labels: o.labels ? o.labels.split(',') : [],
                            val1:{
                                value: o.val1 ? o.val1.split(',')[0] : 0,
                                label: o.val1 ? o.val1.split(',')[1] : ''
                            },
                            val2: {
                                value: o.val2 ? o.val2.split(',')[0] : 0,
                                label: o.val2 ? o.val2.split(',')[1] : ''
                            },
                            link: o.link_name || '',
                            children:[]
                        });
                        createStatus(result.children[idx - 1]);
                    }
                    if(parent.dataset_id) {
                        result.children.forEach(x => {
                            if(parent.dataset_id.some(i => i === x.datasetID)) {
                                x.inTree = true;
                            }
                        });
                        // delete parent.dataset_id;
                        // delete parent.link_id;
                    }
                    // console.log('result',result.children)

                    return result.children;
                } 
            } catch(e) {
                console.log(e.message);
            }
        }
    },
    DataSet: {
        indicators: async (parent, args, {connect}) => {
            console.log('parent',parent)
            try {
                let indicators;
                if(parent.link) {
                    indicators = await connect.execute(`
                    SELECT 
                        ri.id,
                        i.name,
                        i.source,
                        ri.active,
                        CONCAT(cv1.value, ',', cv1.label) AS val1,
                        CONCAT(cv2.value, ',', cv2.label) AS val2
                    FROM relations_indicators ri
                    INNER JOIN indicators i ON ri.indicator_id = i.id AND i.id != 0
                    LEFT JOIN control_values_relations cv1 
                        ON cv1.indicator_id = i.id
                        AND cv1.label = 'min'
                    LEFT JOIN control_values_relations cv2 
                        ON cv2.indicator_id = i.id
                        AND cv2.label = 'max'
                    WHERE ri.link_id = ${parent.id} AND active = 1
                `);
                indicators = [...indicators[0]];
                
                } else {
                    let id = parent.datasetID ? parent.datasetID : parent.id;
                    indicators = await connect.execute(`
                        SELECT 
                            ri.id,
                            i.name,
                            i.source,
                            ri.active,
                            CONCAT(cv1.value, ',', cv1.label) AS val1,
                            CONCAT(cv2.value, ',', cv2.label) AS val2
                        FROM relations_indicators ri
                        INNER JOIN indicators i ON ri.indicator_id = i.id AND i.id != 0
                        LEFT JOIN control_values_relations cv1 
                            ON cv1.indicator_id = i.id
                            AND cv1.label = 'min'
                        LEFT JOIN control_values_relations cv2 
                            ON cv2.indicator_id = i.id
                            AND cv2.label = 'max'
                        WHERE ri.dataset_id = ${id} AND active = 1
                    `);
                    indicators = [...indicators[0]];
                }
                let result = [];
                for(let o of indicators) {
                    let idx = result.push({
                        id: o.id,
                        name: o.name,
                        data: [10000, 20000, 30000],
                        labels: ['08.17', '08.18', '08.20'],
                        val1:{
                            value: o.val1 ? o.val1.split(',')[0] : 0,
                            label: o.val1 ? o.val1.split(',')[1] : ''
                        },
                        val2: {
                            value: o.val2 ? o.val2.split(',')[0] : 0,
                            label: o.val2 ? o.val2.split(',')[1] : ''
                        },
                        source: o.source || '',
                        active: o.active
                    });
                    createStatus(result[idx - 1]);
                }
                return result;
            } catch (e) {
                console.log(e);
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
server.start(() => console.log(`Server is running on http://10.1.100.170:4000`))