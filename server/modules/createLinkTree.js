function createLinkTree(value) {
    let tree = value,
        result = [],
        adjList = [];

        for(let tr of Object.keys(tree)) {
            if(tree[tr].id) {
                if(!adjList.some(x => x.parent_id === tree[tr].parent_id)) {
                    adjList.push({
                        parent_id: tree[tr].parent_id,
                        children: [tree[tr].id]
                    })
                } else if(adjList.some(x => x.parent_id === tree[tr].parent_id)) {
                    let idx = adjList.findIndex(x => x.parent_id === tree[tr].parent_id);
                    adjList[idx].children.push(tree[tr].id);
                }
            }   
        }
        for(let i of adjList[0].children) {
            result.push(JSON.parse(JSON.stringify(findNote(i))));
        }
        for(let i of result) {
            getTree(i, adjList[1]);
        }

        function getTree(parent, child) {
            for(let ch of child.children) {     
                let idx = parent.children.push(JSON.parse(JSON.stringify(findNote(ch))));
                if(adjList.some(x => x.parent_id === ch)) {
                    getTree(parent.children[idx-1], adjList.find(x => x.parent_id === ch));
                }
            }  
        }
        function findNote(childId) {
            let child = tree.find(x => x.id === childId);
            return {
                id: child.id,
                link: child.link_name,
                name: child.name,
                children:[]
            };
        }
        return result;
        
}

module.exports = createLinkTree;