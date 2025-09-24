const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dbconfig= require('./db/dbconfig.js');
const app = express();


const objetivos = require('./routes/objetivos.js');
const empleados = require('./routes/empleados.js');
const usuarios = require('./routes/usuario.js');
const objetivoasignacion = require('./routes/objetivoAsignado.js');
const puntuacion = require('./routes/puntuacion.js');
const login = require('./routes/login.js');
const archivos = require('./routes/archivos.js');
const filtros = require('./routes/filtros.js');
const certificacion = require('./routes/certificacion.js');
const certificacionasignacion = require('./routes/certificacionAsignado.js');
const archivosCertificacion = require('./routes/archivoCertificacion.js');
//<--Middlewares-->//



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morgan('dev'));

//Config

dbconfig(app);
//Rutass 


app.use('/api/objetivos',objetivos);
app.use('/api/empleados',empleados);
app.use('/api/usuarios',usuarios);
app.use('/api/objetivoasignacion',objetivoasignacion);
app.use('/api/puntuacion',puntuacion);
app.use('/api/login',login);
app.use('/api/archivos',archivos);
app.use('/api/archivosCertificacion',archivosCertificacion);
app.use('/api/filtros',filtros);
app.use('/api/certificaciones', certificacion);
app.use('/api/certificacionasignacion', certificacionasignacion);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../../front-end/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front-end/dist', 'index.html'));
});
module.exports = {
    app
};