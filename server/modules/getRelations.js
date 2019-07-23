// function Node(data) {
//     this.data = data;
//     this.parent = null;
//     this.children = []
// }
// function Tree(data) {
//     var node = new Node(data);
//     this._root = node;
// }
function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}
Queue.prototype.enqueue = function(data, level) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};
Queue.prototype.dequeue = function(level) {
    var oldestIndex = this._oldestIndex,
        deletedData = this._storage[oldestIndex];
 
    delete this._storage[oldestIndex];
    this._oldestIndex++;
    return deletedData;
};



function getRelations(tree) {
    (function recurse(currentNode, parentId) {
        console.log('CurrentNode: ', currentNode.id, 'ParentId: ', parentId)
        for(let i = 0, length = currentNode.children.length; i < length; i++) {
            
            recurse(currentNode.children[i], currentNode.id);
        }
    })(tree);

    // let queue = new Queue();

    // queue.enqueue(tree);
    // currentTree = queue.dequeue();
    // // // level++;
    // while(currentTree){
    //     for (var i = 0, length = currentTree.children.length; i < length; i++) {
    //         queue.enqueue(currentTree.children[i]);
    //         console.log("currentTree.children[i].id: ", currentTree.children[i].id)
    //     }

    //     // callback(currentTree);
    //     console.log('CurrentTree.id: ', currentTree.id)
    //     currentTree = queue.dequeue();
        
    // }
    // while(currentTree) {
    //     // level++
    //     for (let i = 0, length = currentTree.children.length; i < length; i++) {
    //         childId.push(currentTree.children[i].id);
    //         queue.enqueue(currentTree.children[i]);
    //     }
    //     parentId = currentTree.id;
    //     // console.log('Level: ', level)
    //     for(let i = 0; i < childId.length; i++) {
    //         result.push([childId[i], parentId]);  
    //     }
    //     currentTree = queue.dequeue(level);
    //     childId = [];
    //     parentId = 0;
    // }
    // return result;
}

module.exports = getRelations;