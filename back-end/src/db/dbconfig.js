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

/*module.exports = function (app) {
    const dbConfig = {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'newschema'
    }; */
    
    app.use(myConnection( mysql, dbConfig, 'pool'));
    
    // Verificar la conexión real a la base de datos
    const connection = mysql.createConnection(dbConfig);
    
    connection.connect((err) => {
        if (err) {
            console.error('❌ Error connecting to database:', err.message);
            console.error('Code:', err.code);
            console.error('SQL State:', err.sqlState);
        } else {
            console.log('✅ Database connected successfully!');
            console.log('📊 Connected to database:', dbConfig.database);
            console.log('🌐 Host:', dbConfig.host);
        }
        connection.end();
    });

