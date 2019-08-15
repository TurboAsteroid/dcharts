function addElementsInTree(report, data) {
    let tmp;
    for(let o of data) {
        if(o.inTree) {
        tmp = Object.assign({}, o);
        tmp.children = [];
        report.children.push(tmp);
        }
    }
    report.children.forEach(x => {
        recurse(x, x.dataSets);
    });
}
function recurse(parent, child) {
    for(let ch of child) {
        if(ch.inTree) {
            let tmp = Object.assign({}, ch);
            tmp.children = [];
            parent.children.push(tmp);
            if(ch.children) {
                recurse(tmp, ch.children);
            }
        }
    }
}
module.exports = addElementsInTree;