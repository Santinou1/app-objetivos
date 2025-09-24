const express = require('express');
const router = express.Router();

router.get('/',obtenerCertificaciones);
router.post('/',agregarCertificacion);
router.get('/marcas',obtenerMarcas);
router.get('/:id',obtenerCertificacion);
router.put('/:id',actualizarCertificacion);
router.delete('/:id',eliminarCertificacion);

async function obtenerCertificaciones(req, res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM certificacion', (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        connection.release();
        res.status(200).json(results);
    }catch(error){
        res.status(500).send(error);
    }
}
async function actualizarCertificacion(req, res) {
    try {
        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });

        const { id } = req.params;
        const { nombreCertificacion, marca, url, anio } = req.body;

        const result = await new Promise((resolve, reject) => {
            connection.query(
                'UPDATE certificacion SET nombreCertificacion = ?, marca = ?, url = ?, anio = ? WHERE idCertificacion = ?',
                [nombreCertificacion, marca, url, anio, id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Certificación no encontrada" });
        }

        res.status(200).json({ message: "Certificación actualizada correctamente" });

    } catch (error) {
        res.status(500).send(error);
    }
}
async function obtenerCertificacion(req,res){
    try{
        const id = req.params.id;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err,conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve,reject)=>{
            connection.query('SELECT * FROM certificacion WHERE idCertificacion = ?',[id],(err,results)=>{
                if(err) reject(err);
                else resolve(results);
            })
        })
        res.send(results[0]);
    }catch(error){
        res.status(500).send(error);
    }
}
async function eliminarCertificacion(req, res) {
    try {
        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });

        const { id } = req.params;

        const result = await new Promise((resolve, reject) => {
            connection.query(
                'DELETE FROM certificacion WHERE idCertificacion = ?',
                [id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Certificación no encontrada" });
        }

        res.status(200).json({ message: "Certificación eliminada correctamente" });

    } catch (error) {
        res.status(500).send(error);
    }
}
async function obtenerMarcas(req,res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM marcas', (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        connection.release();
        res.status(200).json(results);
    }catch(error){
        res.status(500).send(error);
    }
}
async function agregarCertificacion(req,res){
    try {
        
        const { nombreCertificacion, url, marca, anio} = req.body;

        if (!nombreCertificacion|| !url || !marca || !anio) {
            return res.status(400).send("Faltan datos necesarios");
        }
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = 'INSERT INTO certificacion (nombreCertificacion, url, marca, anio) VALUES (?,?,?,?)';
        const results = await new Promise((resolve, reject)=>{
            connection.query(query, [nombreCertificacion, url, marca, anio], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results);
    
    res.status(200).send('Objetivo agregado con exito.');
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = router