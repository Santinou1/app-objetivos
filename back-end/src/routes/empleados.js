const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', obtenerEmpleados);
router.get('/areas',obtenerAreas);
router.get('/:id',obtenerEmpleadoXId);
router.post('/', agregarEmpleado);
router.put('/',actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

async function obtenerEmpleados(req, res) {
    try{ 

        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const query = `SELECT e.idEmpleado, e.nombre, e.puesto, e.area, u.rol, u.activo 
        FROM Empleado e JOIN Usuario u ON e.idEmpleado = u.empleado  `
        const results = await new Promise((resolve, reject)=>{
            connection.query(query, (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results)
        
        
    
        res.status(200).json(results);
    } catch(err){
        res.send(err);
    }
}

async function actualizarEmpleado(req, res) {
    try {
        const {  nombre, puesto ,area, idEmpleado } = req.body;
        if (!nombre || !puesto || !area ||!idEmpleado) {
            return res.status(400).send("Faltan datos necesarios");
            }
        const connection = await new Promise((resolve, reject)=>{
                req.getConnection((err, conn)=>{
                    if(err) reject(err);
                    else resolve(conn);
                });
            });
        const query = `UPDATE Empleado 
        SET nombre = ?, puesto = ?, area= ?
        WHERE idEmpleado = ?
        `;
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[nombre,puesto,area,idEmpleado],(err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });

        

        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
    
}

async function obtenerEmpleadoXId(req,res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const idEmpleado = req.params.id;
        console.log('Id :', idEmpleado)
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Empleado WHERE idEmpleado = ?',[idEmpleado],(err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results);
        res.status(202).send(results[0]);
    }catch(error){
        res.status(404).senf(error)
    }
}
async function eliminarEmpleado(req, res){
    try {
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const id = req.params.id;
        const query = `DELETE FROM Empleado WHERE idEmpleado = ?`;
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[id],(err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function obtenerAreas(req, res){
    try{
        
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Areas', (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results)
        
        
    
        res.status(200).json(results);
    } catch(err){
        res.send(err);
    }
}


async function agregarEmpleado(req, res) {
    try {
        console.log('Entre en agregar emppleado')
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const {nombre, apellido, puesto, area, email, usuarioPassword,rol} = req.body;
        if(!nombre||!apellido||!puesto|| !area|| !email|| !usuarioPassword|| typeof rol === 'undefined'){
            return res.status(400).send("Faltan campos requeridos");
        }
        const empleado = {
            nombre: req.body.nombre+' '+req.body.apellido,
            puesto: req.body.puesto,
            area: req.body.area,

        }
        
        const query = 'INSERT INTO Empleado (nombre, puesto, area) VALUES (?,?,?)';
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[empleado.nombre, empleado.puesto, empleado.area], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });

        const claveForanea = await obtenerUltimoEmpleado(req,res);
        console.log("La clave foranea es: ");
        console.log(claveForanea)

        const usuario = {
            email: req.body.email,
            usuarioPassword : req.body.usuarioPassword,
            rol: req.body.rol ? 'admin' : 'user',
            nombre: req.body.nombre+' '+req.body.apellido,
            empleado: claveForanea[0].idEmpleado,
        }

        const nuevoUsuario = await axios.post('http://localhost:9000/api/usuarios/',usuario);

        console.log(nuevoUsuario.status)
        res.status(200).send({message:"Usuario creado correctamente"});
        
    } catch (error) {
        res.send(error);
    }
}

async function obtenerUltimoEmpleado(req, res){
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
            connection.query('SELECT idEmpleado FROM Empleado ORDER BY idEmpleado DESC LIMIT 1 ', (err, results)=>{
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
module.exports = router;