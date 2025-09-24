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
            AVG(p.valor) AS promedioPuntuacion, 
            o.peso, 
            (o.peso * AVG(p.valor) / 100) AS despeno
            FROM 
                ObjetivoEmpleado oe
            JOIN 
                Empleado e ON oe.empleado = e.idEmpleado
            JOIN 
                Objetivo o ON oe.objetivo = o.idObjetivo
            JOIN 
                Puntuacion p ON oe.idObjetivoEmpleado = p.objetivo
            WHERE 
                e.idEmpleado = ?
                AND p.trimestre > 0
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