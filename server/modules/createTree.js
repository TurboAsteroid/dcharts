
let dataLib = []
function createTree(tree, lib) {
    let adjList = [];
    let result = {
        id: 0,
        name: 'Корневой элемент',
        data:[],
        children:[]
    };
    for(let tr of Object.keys(tree)) {
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
    for(let o of tree) {
        if (o.id != 0) { 
            dataLib.push({
                id: o.id,
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
                link: o.link_name,
                children:[]
            });
        }  
    }
    getTree(result, adjList[0]);
    function getTree(parent, child) {
        for(let ch of child.children) {     
            let idx = parent.children.push(JSON.parse(JSON.stringify(dataLib.find(x => x.id === ch))));
            if(adjList.some(x => x.parentId === ch)) {
                getTree(parent.children[idx-1], adjList.find(x => x.parentId === ch));
            }
        }  
    }
    dataLib = [];
    return result;
}

module.exports = createTree;