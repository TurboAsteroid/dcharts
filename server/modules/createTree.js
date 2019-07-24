
let dataLib = [],
dataLibId = [],
treeId = [];
function createTree(tree, lib) {
    let adjList = [];
    let result = {
        id: 0,
        name: 'Корневой элемент',
        data:[],
        children:[]
    };
    for(let tr of Object.keys(tree)) {
        if(tree[tr].id_note) {
            treeId.push({id: tree[tr].id, noteId: tree[tr].id_note});
            if(!adjList.some(x => x.parentId === tree[tr].parent_id)) {
                adjList.push({
                    parentId: tree[tr].parent_id,
                    children: [tree[tr].id]
                })
            } else if(adjList.some(x => x.parentId === tree[tr].parent_id)) {
                let idx = adjList.findIndex(x => x.parentId === tree[tr].parent_id);
                adjList[idx].children.push(tree[tr].id);
            }
        }
        
    }
    for(let o of lib) {
        dataLibId.push(o.id)
        if (o.id != 0) { 
            dataLib.push({
                id: o.id,
                name: o.name,
                data: o.data.split(','),
                labels: o.labels ? o.labels.split(',') : [],
                val1:{
                    value: o.val1.split(',')[0],
                    label: o.val1.split(',')[1]
                },
                val2: {
                    value: o.val2.split(',')[0],
                    label: o.val2.split(',')[1]
                },
                link: o.link,
                children:[]
            });
        }  
    }
    for(let adj of adjList) {
        if(adj.parentId === 1) {
            getTree(result, adj);
        }
    }
    function getTree(parent, child) {
        for(let ch of child.children) {
            
            let idx = parent.children.push(JSON.parse(JSON.stringify(findNote(ch))));
            if(adjList.some(x => x.parentId === ch)) {
                getTree(parent.children[idx-1], adjList.find(x => x.parentId === ch));
            }
        }  
    }
    dataLib = [],
    dataLibId = [],
    treeId = []
    return result;
}
function findNote(childId) {
    let child;
    childId = treeId.find(x => {
        if(x.id === childId) {
            return x.noteId;
        }
    });
    child = dataLib.find(x => x.id === childId.noteId);
    return child;
}

module.exports = createTree;