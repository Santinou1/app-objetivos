const express = require('express');
const router = express.Router(); 

router.get('/objetivo-con-asignacion',obtenerObjetivosConAsignacion);
router.get('/anios', obtenerAnios);
router.get('/objetivos-por-area',obtenerObteivosPorArea);
async function obtenerObjetivosConAsignacion(req,res){
    try {
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err){
                    console.error("Error al conectar en la base de datos:", err);
                    reject(err);
                }
                else{ 
                    console.log('Conexion exitosa')
                    resolve(conn);
                }
            });
        });
        const query = `SELECT idObjetivo FROM Objetivo o
            JOIN ObjetivoEmpleado oe on oe.objetivo = o.idObjetivo
            GROUP BY idObjetivo;`
        const results = await new Promise((resolve, reject)=>{
            connection.query(query, (err, results)=>{
                if(err){
                    console.error("Error en la consulta:", err);
                    reject(err);
                } 
                else{
                    resolve(results);
                }
            });
        });
        res.send(results);
    } catch (error) {
        res.send(error);
    }
}
async function obtenerObteivosPorArea(req, res){
    try {
        const area = req.query.area;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = `SELECT idObjetivo, area FROM Objetivo o
            JOIN ObjetivoEmpleado oe on oe.objetivo = o.idObjetivo
            JOIN Empleado on idEmpleado = oe.empleado 
            WHERE area = ?
            GROUP BY idObjetivo;`
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[area], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function obtenerAnios(req,res){
    try {
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = 'SELECT DISTINCT YEAR(fechaInicio) as anio FROM Objetivo ORDER BY anio;';
        const results = await new Promise((resolve, reject)=>{
            connection.query(query, (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = router;