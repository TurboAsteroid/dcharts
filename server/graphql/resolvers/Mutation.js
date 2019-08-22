
const activationLib = async (_, {activeLibs}, {connect}) => {
    try {
        for(let l of activeLibs) {
            await connect.execute(`
                UPDATE librarys
                SET
                    active = ${l.active}
                WHERE
                    id = ${l.id}
            `);
        }
    } catch (e) {
        console.log(e.message);
    }
};
const activationTree = async (_, {treeID}, {connect}) => {
    try {
        await connect.execute(`
            UPDATE trees_library
            SET active = 0
        `)
        await connect.execute(`
            UPDATE trees_library
            SET active = 1
            WHERE id = ${treeID}
        `)
    } catch (e) {
        console.log(e)
    }
};
const activationIndicators = async (_,{activeInd}, {connect}) => {
    try {
        console.log(activeInd)
        for(let l of activeInd) {
            await connect.execute(`
                UPDATE relations_indicators
                SET
                    active = ${l.active}
                WHERE
                    id = ${l.id}
            `);
        }
    } catch (e) {
        console.log(e)
    }
};
// Изменение библиотеки в бд
const changeLib = async (_, {library}, {connect}) => {
    const lib = library;
    let dataArr = [];
    let controlValueArr = [];
    let lastDataSetId;
    let newID;
    try {
        if(parseInt(lib.id) !== 0) {
            await connect.execute(`
                UPDATE librarys
                SET 
                    name = ${JSON.stringify(lib.name)}
                WHERE 
                    id = ${parseInt(lib.id)}
            `);
        } else if(parseInt(lib.id) === 0) {
            await connect.execute(`
                INSERT INTO librarys
                    (name, source, active)
                VALUES (${JSON.stringify(lib.name)},${JSON.stringify(lib.source)}, 1)
            `).then(res => { lib.id = res[0].insertId });
            newID = lib.id;
        }
        
        for(let dataset of lib.dataSets) {
            let ID;
            if(!dataset.link) {
                if(dataset.id || dataset.datasetID && JSON.parse(dataset.datasetID) !== 0) { // datasetID - id из БД набора данных добавленного к библиотеке с linkами
                    ID = dataset.id ? JSON.parse(dataset.id) : JSON.parse(dataset.datasetID);
                    await connect.execute(`DELETE FROM dataset_values WHERE dataset_id = ${ID}`);
                    await connect.execute(`DELETE FROM control_values_datasets WHERE dataset_id = ${ID}`);
                } else if(!dataset.id) {
                    [lastDataSetId] = await connect.execute(`
                        SELECT MAX( id ) FROM dataset_library;
                    `);
                    ID = lastDataSetId[0]['MAX( id )'] + 1;
                }
                await connect.execute(`
                    INSERT INTO dataset_library
                    SET
                        id = ${ID},
                        name = ${JSON.stringify(dataset.name)},
                        library_id = ${lib.id}
                    ON DUPLICATE KEY UPDATE 
                        name = ${JSON.stringify(dataset.name)}
                `);
                for(let i = 0; i < dataset.data.length; i++) {
                    dataArr.push([ID, dataset.data[i], dataset.labels[i]]);
                }
                controlValueArr.push(
                    [ID, dataset.val1.value, dataset.val1.label],
                    [ID, dataset.val2.value, dataset.val2.label]                    
                );
            } else if(dataset.link) {
                (async function recurse(currentNode) {
                    try {
                        await connect.execute(`
                            UPDATE link_library
                            SET
                                name = ${JSON.stringify(currentNode.name)}
                            WHERE
                                id = ${JSON.parse(currentNode.id)}
                        `);
                        await connect.execute(`
                            UPDATE control_values_links
                            SET
                                value = ${parseInt(currentNode.val1.value)}
                            WHERE
                                link_id = ${JSON.parse(currentNode.id)} AND label = ${JSON.stringify(currentNode.val1.label)}
                        `);
                        await connect.execute(`
                            UPDATE control_values_links
                            SET
                                value = ${parseInt(currentNode.val2.value)}
                            WHERE
                                link_id = ${JSON.parse(currentNode.id)} AND label = ${JSON.stringify(currentNode.val2.label)}
                        `);
                        
                    } catch (e) {
                        console.error(e.message);
                    }  
                    for(let i = 0, length = currentNode.children.length; i < length; i++) {
                        recurse(currentNode.children[i]);
                    }
                })(dataset);
            }
            
        }
        if(dataArr.length) {
            await connect.query(`INSERT INTO dataset_values (dataset_id, value, label) VALUES ?`, [dataArr]);
        }
        if (controlValueArr.length) {
            await connect.query(`INSERT INTO control_values_datasets (dataset_id, value, label) VALUES ?`, [controlValueArr]);
        }
    } catch (e) {
        console.log(e);
    }
    if(newID) {
        return newID;
    }
};
const changeIndicators = async (_,{indicators}, {connect}) => {
    let allIndicators = [];
    for(let o in indicators) {
        (function recurse(currentNode) {
            currentNode.indicators ? allIndicators.push(...currentNode.indicators) : {}
            if(currentNode.children) {
                for(let i = 0, length = currentNode.children.length; i < length; i++) {
                    recurse(currentNode.children[i]);
                }
            }
        })(indicators[o]);
    }
    if(allIndicators.length) {
        let indicator_id;
        try {
            for(let o of allIndicators) {
                [arr] = await connect.execute(`
                    SELECT indicator_id
                    FROM relations_indicators
                    WHERE id = ${o.id}
                `);
                indicator_id = arr[0].indicator_id;
                // console.log(indicator_id);
                await connect.execute(`
                    UPDATE indicators
                    SET
                        name = ${JSON.stringify(o.name)}
                    WHERE
                        id = ${indicator_id}
                `);
                await connect.execute(`
                    UPDATE control_values_relations
                    SET 
                        value = ${o.val1.value}
                    WHERE
                        indicator_id = ${indicator_id} AND label = ${JSON.stringify(o.val1.label)}
                `);
                await connect.execute(`
                    UPDATE control_values_relations
                    SET 
                        value = ${o.val2.value}
                    WHERE
                        indicator_id = ${indicator_id} AND label = ${JSON.stringify(o.val2.label)}
                `);
            }
        } catch (e) {
            console.log(e);
        }
    }
    
}
const deleteLibrarysOrDataSets = async (_, {libID, datasetID}, {connect}) => {
    if(libID) {
        try {
            await connect.execute(`
                DELETE FROM librarys
                WHERE id = ${libID}
            `);
        } catch (e) {
            console.log(e.message);
        }
    }

    if(datasetID) {
        try {
            for(let o of datasetID) {
                await connect.execute(`
                    DELETE FROM dataset_library
                    WHERE id = ${o}
                `);
            }
        } catch (e) {
            console.log(e.message);
        }
    }
};
const changeTree = async (_, {tree, treeLibrary}, {connect}) => {
    let arr = [];
    let library_id;
    let id;

    try {
        if(treeLibrary.id) {
            id = parseInt(treeLibrary.id);
            await connect.execute(`
                UPDATE trees_library
                SET name = ${JSON.stringify(treeLibrary.name)},
                    date = ${JSON.stringify(treeLibrary.date)}
                WHERE id = ${id}
            `);
            await connect.execute(`DELETE FROM trees WHERE tree_id = ${id}`);
        } else {
            await connect.query(`
                INSERT INTO trees_library 
                    (name, date) 
                VALUES (${JSON.stringify(treeLibrary.name)}, ${JSON.stringify(treeLibrary.date)})
            `).then(res => {
                id = parseInt(res[0].insertId);
            });
        }
        for(let o of tree) {
            library_id = o.id;
            if(o.children.length) {
                recurse(o.children);
            } else {
                arr.push([id, parseInt(library_id), 0, 0]);
            }
            
        }
        await connect.query(`
            INSERT INTO trees
                (tree_id, library_id, dataset_id, link_id)
            VALUES ?
        `, [arr]);
        return !treeLibrary.id ? id : 0;
    } catch(e) {
        console.log(e);
    }
    function recurse(parent) {
        for(let o of Object.keys(parent)) {
            let link_id, dataset_id;

            if(parent[o].link) {
                link_id = parent[o].id,
                dataset_id = 0;
            } else if(parent[o].datasetID){
                link_id = 0,
                dataset_id = parent[o].datasetID;
            } else {
                link_id = 0,
                dataset_id = parent[o].id;
            }
            arr.push([id, parseInt(library_id), parseInt(dataset_id), parseInt(link_id)]);
            if(parent[o].children) {
                recurse(parent[o].children);
            }
        }
    }
};
const deleteTree = async (_, {treeID}, {connect}) => {
    try {
        await connect.execute(`DELETE FROM trees_library WHERE id = ${treeID}`);
    } catch(e) {
        console.log(e);
    }
}

module.exports = {
    changeLib,
    deleteLibrarysOrDataSets,
    activationLib,
    changeTree,
    changeIndicators,
    deleteTree,
    activationTree,
    activationIndicators
};
