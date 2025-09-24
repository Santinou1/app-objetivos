const {app} = require('./app.js');
const port = 9000;
//<--Servidor corriendo-->//

app.listen(port,()=>{
    console.log('Servidor corriendo en puerto: ', port)
});