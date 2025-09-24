const express = require('express');
const router = express.Router();
const {format} = require('date-fns');

router.post('/', agregarAsigancion);
router.delete('/:id', eliminarAsignacion);
router.get('/:id', obtenerCertificacionesAsignadas);
router.put('/:id', actualizarEstadoCertificacion);
router.get('/certificado-empleado/:id', obtenerCertificacionEmpleado);

async function obtenerCertificacionEmpleado(req,res){
    try{
        const id = req.params.id;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = `SELECT * FROM  certificacionempleado WHERE idCertificacionEmpleado = ?;`;
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[id],(err,results)=>{
                if(err) reject(err);
                else resolve(results);
            })
        })
        res.send(results)
    }catch(error){
        res.send(error);
    }
}

async function eliminarAsignacion(req,res){
    try{
        const id = req.params.id;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = 'DELETE FROM certificacionempleado WHERE idCertificacionEmpleado = ?';

         
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[id],(err,results)=>{
                if(err){ 
                    if(err.code === 'ER_DUP_ENTRY'){
                        return res.status(409).send({message:'Esta certificacion ya ha sido asignada a este empleado. '})
                    }
                    reject(err);
                }
                else {
                    resolve(results);
                }
            })
        })
        res.status(200).send(results);

    }catch(error){
        res.send(error);
    }
}

async function actualizarEstadoCertificacion(req,res){
    try{
        const id = req.params.id;
        const {estado, nota, observaciones, fechaLimite} = req.body;
        if(!estado || !nota || !observaciones || !fechaLimite){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = 'UPDATE certificacionempleado SET estado = ?, nota = ?, observaciones = ?, fechaLimite = ? WHERE idCertificacionEmpleado = ?';
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[estado,nota,observaciones,fechaLimite,id],(err,results)=>{
                if(err){ 
                    reject(err);
                }
                else {
                    resolve(results);
                }
            })
        })
        res.status(200).send(results);
    }catch(error){
        res.send(error);
    }
}
async function agregarAsigancion(req,res){
    try{
        const {certificado, empleado, fechaLimite, observaciones, estado} = req.body;
        if(!certificado || !empleado || !fechaLimite ){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = 'INSERT INTO certificacionempleado (certificado, empleado, fechaLimite, observaciones, estado) VALUES (?,?,?,?,?)';
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[certificado,empleado,fechaLimite,observaciones,estado],(err,results)=>{
                if(err){ 
                    if(err.code === 'ER_DUP_ENTRY'){
                        return res.status(409).send({message:'Esta certificacion ya ha sido asignada a este empleado. '})
                    }
                    reject(err);
                }
                else {
                    resolve(results);
                }
            })
        })
        res.status(200).send(results);
    }catch(error){
        res.send(error);
    }
};

async function obtenerCertificacionesAsignadas(req,res){
    try{
        const id = req.params.id;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = `
            SELECT * FROM certificacion c JOIN certificacionempleado ce 
            ON c.idCertificacion = ce.certificado
            WHERE ce.empleado = ? 
            ORDER BY idCertificacionEmpleado ASC;`;
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[id],(err,results)=>{
                if(err) reject(err);
                else resolve(results);
            })
        })
        res.send(results)
    }catch(error){
        res.send(error);
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

module.exports = router;