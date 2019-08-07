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
    createNewNote,
    updateNote,
    deleteNote,
    addLibraryTree,
    updateLibraryTree,
    deleteLibraryTree,
    changeTree
};
