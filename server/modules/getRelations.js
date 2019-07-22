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
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};
Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        deletedData = this._storage[oldestIndex];
 
    delete this._storage[oldestIndex];
    this._oldestIndex++;
 
    return deletedData;
};



function getRelations(tree) {
    let result = [],
    parentId = 0,
    childId = [],
    level = 0;
    // (function recurse(currentNode) {
    //     for(let i = 0, length = currentNode.children.length; i < length; i++) {
    //         console.log('CurrentID', currentNode.children[i].id)
    //         recurse(currentNode.children[i])
    //     }
    //     console.log('CurrentNode', currentNode)
    // })(tree);

    let queue = new Queue();

    queue.enqueue(tree);
    currentTree = queue.dequeue();
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            childId.push(currentTree.children[i].id);
            queue.enqueue(currentTree.children[i]);
        }
        parentId = currentTree.id;
        for(let i = 0; i < childId.length; i++) {
            result.push([childId[i], parentId, level]);
        }
        currentTree = queue.dequeue();
        childId = [];
        parentId = 0;
    }
    // console.log('Result: ', result)
    return result;
}

module.exports = getRelations;