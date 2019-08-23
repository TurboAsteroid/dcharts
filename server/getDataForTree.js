const fetch = require('node-fetch');
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
});

const createDate = require('./modules/date');
const restructJSON = require('./modules/restructJSON');
const getDataByParametr = require('./modules/getDataByParametr');

const getDataForTree = async (parent, linkTree) => {
    let source  = parent.source,
        parametrs = [],
        result;

    linkTree.forEach(x => parametrs.push(x.link_name.split('.')[1]));
    try {
        switch(source) {
            case 'Salary':
                result = await getSalary(parametrs, source)
                break;
            case 'Cu':
                result = await getCu(parametrs, source)
                break;
            default:
                result = null;
                break;
          }
        result ? linkTree.forEach(x => {
            x.data = result.filter(i => i.id === x.link_name).map(i => i.data)[0];
            x.labels = result.filter(i => i.id === x.link_name).map(i => i.labels)[0];
        }) : {};
        return linkTree;
    } catch (e) {
        console.log(e);
    }
};
const getSalary = async (parametrs, source) => {
    try {
        // let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=${parametr}&date=${createDate(12)}`, {agent}); // !!!!!
        let response = await fetch(`https://elem-pre.elem.ru/spline/api/salary?filter=company,sex,platform,byAge&date=${createDate(6)}`, {agent});
        let data = await response.json();
        let restructData = restructJSON(data); // промежеуточная функция преобразования данных из API
        let findData = getDataByParametr(restructData, parametrs, source);
        return findData;
    } catch (e) {
        console.log(e.message);
    }
};
const getCu = async (parametrs) => {
    // console.log('getCu')
};
module.exports = getDataForTree;