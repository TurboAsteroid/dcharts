const mysql = require('mysql2/promise');
const connect =  mysql.createPool({
       host: "localhost",
       user: "root",
       database: "dcharts-2",
       password: "450979",
       multipleStatements: true
});
module.exports = connect;