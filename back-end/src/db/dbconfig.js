const mysql = require('mysql2');
const myConnection = require('express-myconnection');

module.exports = function (app) {
    app.use(myConnection( mysql, {
        host: '172.31.50.155',
        user: 'healthcheck',
        password: 'P1r1d3gm1@',
        database: 'objetivosDB'
    },'pool'));
}
