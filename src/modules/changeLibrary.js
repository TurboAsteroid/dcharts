function createData(library, oldLibrary) {
    let result = {
        update: [],
        create: [],
        delete: []
    },
    arrId = [];
    
    for(let i in library) {
        arrId.push(library[i].id);
    }

    function findUpdate() {
        for(let j in oldLibrary) {
            if (arrId.includes(oldLibrary[j].id)) {
                let id = arrId.find(i => i === oldLibrary[j].id);
                for(let e in library) {
                    if(id === library[e].id && JSON.stringify(library[e]) != JSON.stringify(oldLibrary[j])) {
                        result.update.push(library[e]);
                    }
                }
            }
        }
    }

    if (library.length === oldLibrary.length) {
        findUpdate()
    } else if (library.length > oldLibrary.length) {
        for(let i in library) {
            if(library[i] && !oldLibrary[i]) {
                result.create.push(library[i]);
            }
        }
        findUpdate()
    } else if (library.length < oldLibrary.length) {
        for(let j in oldLibrary) {
            if(!arrId.includes(oldLibrary[j].id)) {
                result.delete.push(oldLibrary[j].id);
            }
        }
        findUpdate();
    }
    return result;
}


module.exports = createData;
