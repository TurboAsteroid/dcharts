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
                levels:0
            });
        }
        // console.log(result)
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
                SELECT MAX( id ) FROM trees_library;
            `);
            id = lastTreeId[0]['MAX( id )'];
        } else {
            id = treeID;
        }
        // let tree = [];
        let [tree] = await connect.execute(`
            SELECT
                id,
                parent_id,
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

        //////////// Получить деревья у которых библиотеки не входят в коллекцию //////////////// 
        // let lib = [];
        // for(let o of templateLibs) {
        //     let s = await connect.execute(`
        //         SELECT
        //             id,
        //             name,
        //             source,
        //             active
        //         FROM librarys
        //         WHERE id = ${o.library_id}
        //     `);
        //     lib.push(...s[0]);
        // }
        ///////////////////////////////////////////////////////////////////////////////////////

        lib.forEach(x => libList.push({
            ...x, 
            ...templateLibs.find(i => i.library_id === x.id),
            inTree: templateLibs.some(i => i.library_id === x.id)
        }));
        
        // libList.push(templateLibs.map(x => x.library_id))
        // console.log('templateLibs',templateLibs)
        // console.log('lib',lib)
        // console.log('liblist', libList)
        
        return libList;
        
    } catch(e) {
        console.log(e);
    }
};
const getLibraryIdInTree = async (_, {treeID}, {connect}) => {
    // console.log(treeID)
    try{
        let [tree] = await connect.execute(`
            SELECT
                id,
                library_id
            FROM trees
            WHERE tree_id = ${treeID}
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

/////////////////////////////////////////////////////////
// const getLibrary = async (_, args, {connect}) => {
//     try {
//         const [rows] = await connect.execute(`
//             SELECT 
//                 library.id,
//                 library.name,
//                 library.link,
//                 CONCAT(v1.value, ',', v1.label) AS val1,
//                 CONCAT(v2.value, ',', v2.label) AS val2,
//                 GROUP_CONCAT(data.value,'') AS data,
//                 GROUP_CONCAT(data.label,'') AS labels
//             FROM library
//             LEFT JOIN value v1 ON v1.library_id = library.id AND v1.label = 'min'
//             LEFT JOIN value v2 ON v2.library_id = library.id AND v2.label = 'max'
//             LEFT JOIN data ON data.library_id = library.id
//             GROUP BY library.id
//         `);
//         // console.log(rows)
//         let data = [];
//         for(let o of rows) {
//             if (o.id != 0) {
//                 data.push({
//                     id: o.id,
//                     name: o.name,
//                     data: o.data ? o.data.split(',').map(x => JSON.parse(x)) : [],
//                     labels: o.labels ? o.labels.split(',') : [],
//                     val1:{
//                         value: o.val1 ? JSON.parse(o.val1.split(',')[0]) : 0,
//                         label: o.val1 ? o.val1.split(',')[1] : ''
//                     },
//                     val2: {
//                         value: o.val2 ? JSON.parse(o.val2.split(',')[0]) : 0,
//                         label: o.val2 ? o.val2.split(',')[1] : ''
//                     },
//                     link: o.link
//                 });
//             }  
//         }
//         return data;
//     } catch (e) {
//         console.error(e.message);
//     }
// };
// const getDataByParametr = async (_,{linkSelected}) => {
//     try {
//         // let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent}); // !!!!!
//         let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=company,sex,platform,byAge&date=${createDate(6)}`, {agent});
//         let data = await response.json();
//         let restructData = restructJSON(data);
        
//         return getDataByParametrModule(restructData, sortLinkSelected[0].linkParametr);
        
//     } catch (e) {
//         console.log(e.message);
//     }
// };
// const getTree = async (parent, {treeId}, {connect}) => {
//     try {
//         const [tree] = await connect.execute(`
//             SELECT * FROM library l
//             JOIN tree t ON l.id = t.id_note AND t.id_tree = ${treeId}
//             ORDER BY parent_id
//         `);
//         const [lib] = await connect.execute(`
//             SELECT 
//                 library.id,
//                 library.name,
//                 library.link,
//                 CONCAT(v1.value, ',', v1.label) AS val1,
//                 CONCAT(v2.value, ',', v2.label) AS val2,
//                 GROUP_CONCAT(data.value,'') AS data,
//                 GROUP_CONCAT(data.label,'') AS labels
//             FROM library
//             LEFT JOIN value v1 ON v1.library_id = library.id AND v1.label = 'min'
//             LEFT JOIN value v2 ON v2.library_id = library.id AND v2.label = 'max'
//             LEFT JOIN data ON data.library_id = library.id
//             GROUP BY library.id
//         `);
        
//         let result = createTree(tree, lib);
//         return result;
//     } catch (e) {
//         console.error(e.message);
//     }
// };
// const getData = async () => {
//     return {};
// };
// const getLibraryLink = async (_, args, {connect}) => {
//     try {
//         const [libLink] = await connect.execute(`
//             SELECT * FROM link_salary
//             WHERE id != 0
//         `);
//         let result = createLinkTree(libLink);
//         return JSON.stringify(result);
//     } catch (e) {
//         console.error(e.message);
//     }
// };
// const getLibraryTree = async (_, args, {connect}) => {
//     try {
//         const [libTree] = await connect.execute(`
//             SELECT * FROM library_trees
//             WHERE id != 0
//         `);
//         let result = [];
//         for(let o of Object.keys(libTree)) {
//             result.push({
//                 id: libTree[o].id,
//                 title: libTree[o].title,
//                 date: libTree[o].date
//             });
//         }
//         console.log(result)
//         return result;
//     } catch (e) {
//         console.error(e.message);
//     }
// };
module.exports = {
    getActiveLibrarys,
    getLibrarysList,
    getLibrarys,
    getTreesLibrary,
    getTree,
    getLibraryIdInTree
//////////////////////////
    // getLibrary,
    // getDataByParametr,
    // getTree,
    // getData,
    // getLibraryLink,
    // getLibraryTree
};
