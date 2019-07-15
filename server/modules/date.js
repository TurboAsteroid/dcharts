const createDate = (count) => {
    // const count = 12;
    let dateCurrent = new Date()
    let date;
    let result = '';

    for(let i = 2; i < count + 2; i++) {
        date = new Date(dateCurrent.getFullYear(), dateCurrent.getMonth() - i, dateCurrent.getDay())
        result += `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : 
                    date.getMonth() + 1}.${date.getFullYear()},`                  
    }
    return result;
}
module.exports = createDate;