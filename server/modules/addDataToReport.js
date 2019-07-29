function addDataToReport(report, data) {
    (function add(rep){
        if(rep.children.length) {
            for(let o of rep.children){
                add(o);
                if(o.link && data.some(x => x.id === o.link)) {
                    let add = data.find(x => x.id === o.link);
                    o.data = add.data;
                    o.labels = add.labels;
                }
            }
        }
    })(report);
    console.log(report)
    return report;
}

module.exports = addDataToReport;