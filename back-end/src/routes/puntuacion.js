const express = require('express');
const router = express.Router();

router.post('/',agregarPuntuacion);
router.get('/puntuacionBarra/:id', obtenerPuntuacionBarra);
router.get('/:id',obtenerPuntaciones);


async function agregarPuntuacion(req, res){
    try {
        
        const puntuacion = {
            objetivo: req.body.objetivo,
            valor: req.body.valor,
            fechaPuntuacion: req.body.fechaPuntuacion,
            comentario: req.body.comentario,
            trimestre: req.body.trimestre
        }

        // Validación del peso máximo permitido por trimestre
        const maxPesoPorTrimestre = 100; // 100% por trimestre
        
        if(puntuacion.valor > maxPesoPorTrimestre){
            return res.status(400).send({
                message: `El peso máximo permitido por trimestre es ${maxPesoPorTrimestre}%.`
            });
        }

        // Validación del valor entre 0 y 100
        if(puntuacion.valor < 0 || puntuacion.valor > 100){
            return res.status(400).send({
                message: 'El valor debe estar entre 0 y 100.'
            });
        }

        console.log(puntuacion)
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });

        const query = 'INSERT INTO Puntuacion (objetivo, valor, fechaPuntuacion,comentario,trimestre) VALUES (?,?,?,?,?)';
      
        const results = await new Promise((resolve,reject)=>{
            connection.query(query, [puntuacion.objetivo, puntuacion.valor, puntuacion.fechaPuntuacion,puntuacion.comentario, puntuacion.trimestre], (err, results)=>{
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
        res.status(202).send(results);
    }catch (error) {
        res.send(error);
    }
}

async function obtenerPuntuacionBarra(req,res) {
    try {
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const id = req.params.id;
        const query = `SELECT 
            oe.idObjetivoEmpleado, 
            o.titulo, 
            (SUM(p.valor) / 4) AS promedioPuntuacion, 
            o.peso, 
            (SUM(p.valor) / 4) AS despeno,
            (o.peso * SUM(p.valor) / 4 / 100) AS desempenoPonderado
            FROM 
                ObjetivoEmpleado oe
            JOIN 
                Empleado e ON oe.empleado = e.idEmpleado
            JOIN 
                Objetivo o ON oe.objetivo = o.idObjetivo
            LEFT JOIN 
                Puntuacion p ON oe.idObjetivoEmpleado = p.objetivo AND p.trimestre > 0
            WHERE 
                e.idEmpleado = ?
            GROUP BY    oe.idObjetivoEmpleado, o.titulo, o.peso
            ORDER BY idOBjetivoEmpleado ASC;`
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[id], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        res.status(202).send(results);
        
    } catch (error) {
        res.send(error);
    }
    
}

async function obtenerPuntaciones(req,res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const id = req.params.id;
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Puntuacion WHERE objetivo = ? ORDER BY idPuntuacion DESC',[id], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        res.status(202).send(results);
    }catch(error){
        res.status(500).send(error)
    }
}
module.exports = router