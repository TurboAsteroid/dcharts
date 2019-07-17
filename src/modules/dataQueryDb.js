function createData(library, oldLibrary) {
    let result = {
        update: [],
        create: [],
        delete: []
    };
    if (library.length === oldLibrary.length) {
        for(let i in library) {
            for(let j in oldLibrary[i]) {
                if(library[i][j] && oldLibrary[i][j] && JSON.stringify(library[i][j]) != JSON.stringify(oldLibrary[i][j])) {
                    result.update.push(library[i])
                }
            }
        }
    } else if (library.length > oldLibrary.length) {
        for(let i in library) {
            if(library[i] && !oldLibrary[i]) {
                result.create.push(library[i])
            }
            for(let j in oldLibrary[i]) {
                if(library[i][j] && oldLibrary[i][j] && JSON.stringify(library[i][j]) != JSON.stringify(oldLibrary[i][j])) {
                    result.update.push(library[i])
                }
            }
        }
    } else if (library.length < oldLibrary.length) {
        let arrId = []
        for(let i in library) {
            arrId.push(library[i].id)
        }
        for(let j in oldLibrary) {
            if(!arrId.includes(oldLibrary[j].id)) {
                result.delete.push(oldLibrary[j])
            } else if (arrId.includes(oldLibrary[j].id)) {
                let id = arrId.find(i => i === oldLibrary[j].id)
                for(let e in library) {
                    if(id === library[e].id && JSON.stringify(library[e]) != JSON.stringify(oldLibrary[j])) {
                        result.update.push(library[e])
                    }
                }
            }
        }
    }
    return result
}


module.exports = createData
