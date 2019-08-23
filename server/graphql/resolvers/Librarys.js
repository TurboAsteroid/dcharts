const createStatus = require('../../modules/createStatus');
const getDataForTree = require('../../getDataForTree');
const createTree = require('../../modules/createTree');

const dataSets = async (parent, {addData}, {connect}) => {
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
            return data;
        } else if(parent.source) {
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
            }
            return result.children;
        } 
    } catch(e) {
        console.log(e.message);
    }
};

module.exports = {
    dataSets
};