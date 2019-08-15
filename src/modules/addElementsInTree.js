function addElementsInTree(report, data) {
    let tmp
       for(let o of data) {
           if(o.inTree) {
            tmp = Object.assign({}, o)
            tmp.children = []
            report.children.push(tmp);
           }
       }
       report.children.forEach(x => {
           recurse(x, x.dataSets)
       })
       console.log(report)

    //    recurse()
}
function recurse(parent, child) {
    console.log(child)
    for(let ch of child) {
        if(ch.inTree) {
            let tmp = Object.assign({}, ch);
            tmp.children = []
            parent.children.push(tmp)
            if(ch.children) {
                recurse(tmp, ch.children)
            }
        }
        // if(ch.children.length) {
        //     // recurse(ch, ch.children);

        // }
    }
}
module.exports = addElementsInTree;