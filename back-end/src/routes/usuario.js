const express = require('express');
const router = express.Router();
const {encriptarContrasena, verificarContrasena} = require('../utils/encriptacion.js');

router.post('/', agregarUsuario);
router.put('/',actualizarUsuario);
router.post('/confirm', confirmarContrasena);
router.put('/confirm',actualizarContrasena);
router.get('/:id',obtenerUsuario);
router.put('/:id', cambiarEstadoUsuario);

async function obtenerUsuario(req, res){
    try{
        const id = req.params.id;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT idUsuario, email, rol, empleado, activo FROM Usuario WHERE empleado = ?',[id], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results);
        res.send(results[0]);
    }catch(error){
        res.status(500).send(error);
    }

}
async function confirmarContrasena(req,res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const {idUsuario, usuarioPassword} = req.body;
        if(!idUsuario || !usuarioPassword){
            return res.status(400).send({message:"Faltan datos"});
        }
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT usuarioPassword FROM Usuario WHERE idUsuario = ?',[idUsuario], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        const esCorrecta = await verificarContrasena(usuarioPassword, results[0].usuarioPassword);
        if (esCorrecta) {
            res.status(200).send('Contraseña verificada.');
        } else {
            res.status(400).send({message:"La contraseña no es valida."});
        }
         
        
        
    }catch(error){
        res.status(500).send({message:"Error en el servidor"});
    }
}
async function actualizarContrasena(req,res){
    try{
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const {idUsuario, usuarioPassword} = req.body;
        if(!idUsuario || !usuarioPassword){
            return res.status(400).send({message:"Faltan datos"});
        }
        const contraEncriptada = await encriptarContrasena(usuarioPassword);
        const results = await new Promise((resolve, reject)=>{
            connection.query('UPDATE Usuario SET usuarioPassword = ? WHERE idUsuario = ?',[contraEncriptada,idUsuario], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results);
        res.status(200).send({message:"Contraseña actualizada correctamente!"});

    }catch(error){
        res.status(500).send({message:"Error en el servidor"});
    }
}
async function agregarUsuario(req,res){
    try {
        console.log('Entre a post usuario')
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });

        const activo = true;
        const {email, usuarioPassword, rol, empleado, nombre} = req.body
        const contraEncriptada = await encriptarContrasena(usuarioPassword);
        const query = 'INSERT INTO Usuario (email, usuarioPassword, rol, empleado, activo, nombre) VALUES (?,?,?,?,?,?)';
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[email, contraEncriptada, rol, empleado, activo, nombre], (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });


        res.send(results);

    } catch (error) {
        res.send(error);
    }

}
async function actualizarUsuario(req,res){
    try {
        const {  email, rol, empleado,nombre } = req.body;
        console.log("Entre en actualizar ususarop")
        console.log(req.body)
        // Verificar que todos los datos necesarios estén presentes
        if (!email || !rol ||!empleado) {
        return res.status(400).send("Faltan datos necesarios papa de dio");
        }

        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });

        const query = `
        UPDATE Usuario 
        SET email = ?, rol= ?,nombre = ?
        WHERE empleado = ?
        `;
        console.log(email)
        const results = await new Promise((resolve, reject)=>{
            connection.query(query,[email, rol,nombre,empleado], (err, results)=>{
                if (err) {
                    console.error('Error en la consulta SQL:', err); // Muestra el error específico
                    reject(err);
                } else {
                    console.log('Resultado de la consulta SQL:', results); // Log para ver lo que devuelve la consulta
                    resolve(results);
                }
            });
        });

        console.log(results)
        res.status(200).send(results);

    } catch (error) {
        res.send(error);
    }
    
}
async function cambiarEstadoUsuario(req, res) {
    try {
        const id = req.params.id;
        const activo = req.body.activo;
        let nuevoEstado = -1;
        if(activo === 1){
            nuevoEstado = 0
        }else{
            nuevoEstado = 1
        }
        console.log('ESTADO ANTERIOR DE LA CUENTA:', activo);
        console.log('SE VA A CAMBIAR A :', nuevoEstado);
        if(!id){
            return res.status(400).send({message:"Falta id"});
        }
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('UPDATE Usuario SET activo = ? WHERE idUsuario = ?',[nuevoEstado, id], (err, results)=>{
                if (err) {
                    console.error('Error en la consulta SQL:', err); // Muestra el error específico
                    reject(err);
                } else {
                    console.log('Resultado de la consulta SQL:', results); // Log para ver lo que devuelve la consulta
                    resolve(results);
                }
            });
        });
        res.status(200).send('Estado actualizado');
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = router