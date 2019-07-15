const getData = (obj, parametr) => {
    console.log(obj);
    const params = parametr.split(',')
    let result = []
    // {
    //     id:'',
    //     data: [],
    //     labels: []
    // }
    
    for(let param of Object.keys(obj)) {
        // result[0].id = param;
        if(params.includes(param)){
            //console.log(param)
            for(let o of obj[param]) {
                //console.log(o)

            }
        }
        // console.log(o)
        // console.log(obj[o][1])
    }
    console.log(result)
    return result
    
}
module.exports = getData;