function sortLinks(report) {
    let linkSelected = [];

    (function getLink(rep){
    if(rep.children.length) {
        for(let o of rep.children){
            getLink(o);
            if(o.link) {
                linkSelected.push({
                linkSource: o.link.split('.')[0],
                linkParametr: o.link.split('.')[1]        
                });
            }
        }
    }
    })(report);

    let sortLinkSelected = [];
    for(let o of linkSelected) {
        if(sortLinkSelected && sortLinkSelected.some(x => x.linkSource === o.linkSource)) {
            sortLinkSelected.find(x => {
                if(x.linkSource === o.linkSource){
                    x.linkParametr.push(o.linkParametr);
                }
            });
        } else {
            sortLinkSelected.push({
                linkSource: o.linkSource,
                linkParametr: [o.linkParametr]
            });
        }
    }
    return sortLinkSelected;
}

module.exports = sortLinks;