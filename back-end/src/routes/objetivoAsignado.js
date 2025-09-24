const express = require('express');
const router = express.Router();
const {format} = require('date-fns'); 
const axios = require('axios');
const fs = require('fs'); // Módulo de Node.js para interactuar con el sistema de archivos
const path = require('path'); // Módulo para trabajar con rutas de archivos

router.post('/', agregarAsignacion);
router.get('/asignacion/:id', obtenrAsignacion);
router.get('/:id',obtenerObjetivosAsignados);
router.delete('/:id',eliminarAsignacion);

async function agregarAsignacion(req, res){
    try {
        if(!req.body.fecha || !req.body.idEmpleado || !req.body.idObjetivo){
            return res.status(400).json({message : "Todos los campos son obligatorios"})

        }
        const asignacion = {
            fechaAsignacion: req.body.fecha,
            empleado: req.body.idEmpleado,
            objetivo: req.body.idObjetivo,
        }

        console.log(asignacion)
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });

        const query = 'INSERT INTO ObjetivoEmpleado (fechaAsignacion, empleado, objetivo) VALUES (?,?,?)';
        const results = await new Promise((resolve,reject)=>{
            connection.query(query, [asignacion.fechaAsignacion, asignacion.empleado, asignacion.objetivo], (err, results)=>{
                if(err){ 
                    if(err.code === 'ER_DUP_ENTRY'){
                        return res.status(409).send({message:'Este objetivo ya ha sido asignado a este empleado. '})
                    }
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });

        const ultimaAsignacion = await obtenerUltimaAsignacion(req,res);
        const data = {
            objetivo: ultimaAsignacion[0].idObjetivoEmpleado,
            valor: 0,
            fechaPuntuacion: req.body.fecha,
            comentario: '',
            trimestre: 0,
        }
        console.log(ultimaAsignacion)
        console.log(data)
        const nuevaPuntuacion = await axios.post('http://localhost:9000/api/puntuacion/',data);
        console.log(nuevaPuntuacion);
        res.status(200).send(results);
    } catch (error) {
        res.send(error);
    }
}

async function obtenerObjetivosAsignados(req, res) {
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const empleado = req.params.id;
        const query = `SELECT * FROM Objetivo o JOIN ObjetivoEmpleado oe ON o.idObjetivo= oe.objetivo WHERE oe.empleado = ? ORDER BY idOBjetivoEmpleado ASC;`;

        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[empleado], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results);
        const formateado = formatearFecha(results);
      
        res.status(202).send(formateado);
    }catch(error){
        res.status(500).send(error);
    }
}

async function obtenrAsignacion(req,res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const asignacion = req.params.id;
        const query = `SELECT * FROM ObjetivoEmpleado WHERE idObjetivoEmpleado = ?;`;

        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[asignacion], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        }); 
        res.status(200).send(results[0]);
    }catch(error){
        res.status(500).send(error);
    }
}

const formatearFecha = (objetivos)=>{
    let formateo = objetivos.map(objetivo => ({
        ...objetivo,
        fechaInicio: new Date(objetivo.fechaInicio),
        fechaFinal : new Date(objetivo.fechaFinal),
        fechaAsignacion: new Date(objetivo.fechaAsignacion),
    }));
    return formateo.map(fecha => ({
        ...fecha,
        fechaInicio: format(fecha.fechaInicio,'dd/MM/yyyy'),
        fechaFinal: format(fecha.fechaFinal,'dd/MM/yyyy'),
        fechaAsignacion: format(fecha.fechaAsignacion,'dd/MM/yyyy')
    }));
}

async function obtenerUltimaAsignacion(req, res){
    try {
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err){
                    console.error("Error al conectar en la base de datos:", err);
                    reject(err);
                }
                else{ 
                    resolve(conn);
                }
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT idObjetivoEmpleado FROM ObjetivoEmpleado ORDER BY idObjetivoEmpleado DESC LIMIT 1 ', (err, results)=>{
                if(err){
                    console.error("Error en la consulta:", err);
                    reject(err);
                } 
                else{
                    resolve(results);
                }
            });
        });
        
        return (results);
    } catch (err) {
        throw err;
    }
}

async function eliminarAsignacion(req, res){
    try{
        const id = req.params.id;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err){
                    console.error("Error al conectar en la base de datos:", err);
                    reject(err);
                }
                else{ 
                    resolve(conn);
                }
            });
        });
        const archivos = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM Archivos WHERE Puntuacion IN (SELECT idPuntuacion FROM Puntuacion WHERE objetivo = ?)',
                [id],
                (err, results) => {
                    if (err) {
                        console.error("Error al obtener los archivos:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        archivos.forEach(archivo => {
            const archivoPath = archivo.ruta;
            if (fs.existsSync(archivoPath)) {
                fs.unlinkSync(archivoPath); // Eliminar archivo
                console.log(`Archivo eliminado: ${archivoPath}`);
            }
        });
        
        const results = await new Promise((resolve,reject)=>{
            connection.query('DELETE FROM ObjetivoEmpleado WHERE idObjetivoEmpleado = ?',[id],(err,results)=>{
                if(err){
                    console.error("Error en la consulta:", err);
                    reject(err);
                } 
                else{
                    resolve(results);
                }
            });
        });

        res.status(200).send(results);

    }catch(error){
        res.send(error);
    }
}
module.exports = router;