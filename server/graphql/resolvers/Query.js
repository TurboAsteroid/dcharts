const fetch = require('node-fetch');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
});
const createTree = require('../../modules/createTree');
const createLinkTree = require('../../modules/createLinkTree');
const createDate = require('../../modules/date');
const restructJSON = require('../../modules/restructJSON');
const getDataByParametrModule = require('../../modules/getDataByParametr');

const getActiveLibrarys = async (_, args, {connect}) => {
    try {
        const [libList] = await connect.execute(`
            SELECT
                id,
                name,
                source,
                active
            FROM librarys
            WHERE id != 0 AND active = 1
        `);
        return libList;
    } catch(e) {
        console.log(e.message);
    }
}
const getLibrarysList = async (_, args, {connect}) => {
    try {
        const [libList] = await connect.execute(`
            SELECT
                id,
                name,
                source,
                active
            FROM librarys
            WHERE id != 0
        `);
        return libList;
    } catch(e) {
        console.log(e.message);
    }
};
const getLibrarys = async (_, {LibID}, {connect}) => {
    
    try {
        let libList = [];
        for(let i of LibID) {
            let [lib] = await connect.execute(`
                SELECT
                    id,
                    name,
                    source,
                    active
                FROM librarys
                WHERE id = ${i}
            `);
            libList.push(lib[0]);
        }
        return libList;
        
    } catch(e) {
        console.log(e.message);
    }
    
};
const getTreesLibrary = async (_, args, {connect}) => {
    try {
        const [libTree] = await connect.execute(`
            SELECT * FROM trees_library
            WHERE id != 0
        `);
        let result = [];
        for(let o of Object.keys(libTree)) {
            result.push({
                id: libTree[o].id,
                name: libTree[o].name,
                date: libTree[o].date,
                levels:0,
                active: libTree[o].active
            });
        }
        // console.log('libTree',libTree)
        return result;
    } catch (e) {
        console.error(e.message);
    }
};
const getTree = async (_, {treeID, lastTree}, {connect}) => {
    try {
        let id;
        if(lastTree) {
            [lastTreeId] = await connect.execute(`
                SELECT id FROM trees_library WHERE active = 1;
            `);
            id = lastTreeId[0]['id'];
        } else {
            id = treeID;
        }
        // let tree = [];
        let [tree] = await connect.execute(`
            SELECT
                id,
                library_id,
                dataset_id,
                link_id
            FROM trees
            WHERE tree_id = ${id}
        `);
        let templateLibs = [];
        for(let tr of Object.keys(tree)) {
            if(!templateLibs.some(x => x.library_id === tree[tr].library_id)) {
                templateLibs.push({
                    library_id: tree[tr].library_id,
                    link_id: tree[tr].link_id ? [tree[tr].link_id] : [],
                    dataset_id: tree[tr].dataset_id ? [tree[tr].dataset_id] : []
                });
            } else if(templateLibs.some(x => x.library_id === tree[tr].library_id)) {
                let idx = templateLibs.findIndex(x => x.library_id === tree[tr].library_id);
                tree[tr].link_id ? templateLibs[idx].link_id.push(tree[tr].link_id) : {};
                tree[tr].dataset_id ? templateLibs[idx].dataset_id.push(tree[tr].dataset_id) : {};
            }
        }
        // console.log(templateLibs)
        let libList = [];
        let [lib] = await connect.execute(`
            SELECT
                id,
                name,
                source,
                active
            FROM librarys
            WHERE active = 1
        `);

        lib.forEach(x => {
            libList.push({
                ...x, 
                ...templateLibs.find(i => i.library_id === x.id),
                inTree: templateLibs.some(i => i.library_id === x.id)
            })
        });
        
        // libList.push(templateLibs.map(x => x.library_id))
        // console.log('templateLibs',templateLibs)
        // console.log('lib',lib)
        // console.log('liblist', libList)
        
        return libList;
        
    } catch(e) {
        console.log(e);
    }
};
const getLibraryIdInTree = async (_, {treeID, lastTree}, {connect}) => {
    // console.log(treeID)
    try{
        let id;
        if(lastTree) {
            [lastTreeId] = await connect.execute(`
                SELECT id FROM trees_library WHERE active = 1;
            `);
            console.log(lastTreeId)
            if(lastTreeId.length) {
                id = lastTreeId[0]['id'];
            }else {
                [lastTreeId] = await connect.execute(`
                    SELECT MAX(id) FROM trees_library;
                `);
                id = lastTreeId[0]['MAX(id)']
            }
        } else {
            id = treeID;
        }
        // let tree = [];
        let [tree] = await connect.execute(`
            SELECT
                id,
                library_id
            FROM trees
            WHERE tree_id = ${id}
        `);
        let templateLibs = [];
        for(let tr of Object.keys(tree)) {
            if(!templateLibs.some(x => x === tree[tr].library_id)) {
                templateLibs.push(tree[tr].library_id);
            }
        }
        // console.log('templateLibs',templateLibs);
        return templateLibs;
    } catch(e) {
        console.log(e)
    }
};
const getData = async () => {
    return {};
};
const getIndicators = async (_, {id, boolLink}, {connect}) => {
    try {
        let indicators;
        if(boolLink) {
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
                WHERE ri.link_id = ${id}
            `);
            indicators = [...indicators[0]];
        } else {
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
                WHERE ri.dataset_id = ${id}
            `);
            indicators = [...indicators[0]];
        }
        let result = [];
        for(let o of indicators) {
            result.push({
                id: o.id,
                name: o.name,
                data: [],
                labels: [],
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
        }
        return result;
    } catch (e) {
        console.log(e);
    }
    
};
const getCharts = async (_,{id, boolLink, boolDataset}, {connect}) => {
    console.log('id',id)
    console.log('boolLink',boolLink)
    console.log(' boolDataset', boolDataset)
    let element_id,
        charts = [],
        obj = {}
    try {
        if(boolLink) {
            let [x] = await connect.execute(`
                SELECT id
                FROM trees
                WHERE link_id = ${id}
            `);
            element_id = x[0].id;
            [a] = await connect.execute(`
                SELECT 
                    bar,
                    line,
                    pie,
                    indicators
                FROM charts
                WHERE elements_trees_id = ${element_id}
            `);
            obj = a[0];
        } else if(boolDataset) {
            let [x] = await connect.execute(`
                SELECT id
                FROM trees
                WHERE dataset_id = ${id}
            `);
            element_id = x[0].id;
            [a] = await connect.execute(`
                SELECT 
                    bar,
                    line,
                    pie,
                    indicators
                FROM charts
                WHERE elements_trees_id = ${element_id}
            `);
            obj = a[0];
        }
        charts = [
            {
                title: 'Линейная диаграмма',
                active: obj.line ? true : false
            },
            {
                title: 'Столбчатая диаграмма',
                active: obj.bar ? true : false
            },
            {
                title: 'Круговая диаграмма',
                active: obj.pie ? true : false
            }, 
            {
                title: 'Показатели',
                active: obj.indicators ? true : false
            }
        ];
        return charts;
    } catch(e) {
        console.log(e)
    }
    
};

module.exports = {
    getActiveLibrarys,
    getLibrarysList,
    getLibrarys,
    getTreesLibrary,
    getTree,
    getLibraryIdInTree,
    getData,
    getIndicators,
    getCharts
};
