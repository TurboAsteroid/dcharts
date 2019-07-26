function getData(data, parametr) {

    let result = [],
        dataArr = [],
        labelsArr = [];

    for (let obj of data) {
        for (let itemObj of Object.keys(obj)) {
            if (itemObj === "id" && parametr.includes(obj[itemObj])){              
                for (let i in obj.children) {
                    if (obj.children[i].id) {
                        labelsArr.push(obj.children[i].id);
                        dataArr.push(JSON.parse(obj.children[i].values[obj.children[i].values.length - 1].value));
                    } else if (!(obj.children[i].id)) {
                        labelsArr.push(obj.children[i].label);
                        dataArr.push(JSON.parse(obj.children[i].value));
                    }            
                }
                result.push({
                    id: `salary.${obj[itemObj]}`,
                    data: dataArr,
                    labels: labelsArr
                });
                labelsArr = [];
                dataArr = [];
            } else if (itemObj === "children" && !parametr.includes(obj[itemObj])) {
                for(let i in obj.children) {
                    if(obj.children[i].id && parametr.includes(obj.children[i].id)) {
                        for(let j in obj.children[i].values) {
                            dataArr.push(JSON.parse(obj.children[i].values[j].value));
                            labelsArr.push(obj.children[i].values[j].label);
                        }   
                        result.push({
                            id: `salary.${obj.children[i].id}`,
                            data: dataArr,
                            labels: labelsArr
                        });
                        labelsArr = [];
                        dataArr = [];
                    }
                }     
            }
        }
    }
    return result;
}

module.exports = getData;