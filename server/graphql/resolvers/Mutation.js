
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
        console.log(e.message);
    }
    if(newID) {
        return newID;
    }
};
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


/////////////////////////////////////////////////////////
const createNewNote = async (_, {data}, {connect}) => {
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
};
const updateNote = async (_, {data}, {connect}) => {
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
};
const deleteNote = async (_, {data}, {connect}) => {
    if (data.length != 0) {
        let noteId = data.map(e => JSON.parse(e));     
        try {
            await connect.execute(`DELETE FROM library WHERE id in (${noteId})`);
        } catch (e) {
            console.error(e.message);
        }
        //return [data.id]
    }   
};
const addLibraryTree = async (_, {tree}, {connect}) => {
    let arr = [[tree.title,tree.date]];
    try {
        await connect.query(`INSERT INTO library_trees (title, date) VALUES ?`, [arr]);
    } catch(e) {
        console.error(e.message);
    }
};
const updateLibraryTree = async (_, {tree}, {connect}) => {
    let arr = [[tree.title,tree.date]];
    try {
        await connect.query(`UPDATE library_trees SET title=${JSON.stringify(tree.title)}, date=${JSON.stringify(tree.date)} WHERE id=${tree.id}`);
    } catch(e) {
        console.error(e.message);
    }
};
const deleteLibraryTree = async (_, {trees}, {connect}) => {
    try {
        for(let o of trees) {
            await connect.execute(`DELETE FROM library_trees WHERE id = ${parseInt(o.id)}`);
        }
    } catch(e) {
        console.error(e.message);
    }
};
const changeTree = async (_, {tree, currentTree}, {connect}) => {
    let idTree;
    if(currentTree.id) {
        idTree = currentTree.id;
    }else if(!currentTree.id) {
        const [last] = await connect.execute(`
            SELECT id FROM library_trees ORDER BY id DESC LIMIT 1
        `);
        idTree = last[0].id;
    }

    await connect.execute(`DELETE FROM tree WHERE id_note != 0 AND id_tree = ${idTree}`);
    let res = [];
    (async function recurse(currentNode, parentId = 1) {
        for(let i = 0, length = currentNode.children.length; i < length; i++) { 
            try {
                if(parentId && parentId != 0) {
                    res = await connect.query(`INSERT INTO tree (id_note, parent_id, id_tree) VALUES (${parseInt(currentNode.children[i].id)}, ${parentId}, ${idTree})`);
                    recurse(currentNode.children[i], res[0].insertId);       
                }
            } catch (e) {
                console.error(e.message);
            }  
        }
    })(tree); 
};

module.exports = {
    changeLib,
    deleteLibrarysOrDataSets,
    activationLib,
    
/////////////////////
    createNewNote,
    updateNote,
    deleteNote,
    addLibraryTree,
    updateLibraryTree,
    deleteLibraryTree,
    changeTree
};
