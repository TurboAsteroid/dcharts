const getData = (obj) => {
    let jsonData = obj,
        result = [],
        arrChild = [],
        values = [];

    for(let jsonObj of Object.keys(jsonData)) {

        let childId = [],
            children = [];

        for(let itemChildren of jsonData[jsonObj]) {    
            for(let item of Object.keys(itemChildren)) {
                if(item !== "date" && item !== "value") {
                    arrChild.push({
                        id: item,
                        values: {
                            value:  itemChildren[item],
                            label:  itemChildren.date
                        }
                    });
                    if(!childId.includes(item)) {
                        childId.push(item);
                    }
                } else if (item !== "date" && item == "value") {
                    arrChild.push({
                        value: itemChildren[item],
                        label: itemChildren.date
                    });
                }
            }
           
        }
        if(childId.length != 0) {
            for(let i in childId) {
                values = arrChild.filter(x => x.id === childId[i]).map(x => x.values);
                children.push({
                    id:childId[i],
                    values
                });
            }
        } else if (childId.length == 0) {
            children = arrChild;
        }
        
        result.push({
            id: jsonObj,
            children
        });
        arrChild = [];
    } 
    return result;
};

module.exports = getData;