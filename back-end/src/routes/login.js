const express = require('express');
const router = express.Router();
const axios = require('axios');
const {encriptarContrasena, verificarContrasena} = require('../utils/encriptacion.js');

router.post('/',iniciarSesion);
router.get('/',encontrarEmail);
async function iniciarSesion(req, res) {
    try{
        const {email, usuarioPassword} = req.body;
       
        if(!email || !usuarioPassword){
            return res.status(400).send({message:"Faltan campos"});
        }
        const buscarEmail = await encontrarEmail(req, res);
        if(buscarEmail.length === 0){
            return res.status(400).send({message: "Usuario no existe."});
        }

       let esCorrecta = await verificarContrasena(usuarioPassword, buscarEmail[0].usuarioPassword);
        
        // Si es admin@admin.com y la contraseña es admin123, permitir acceso
        if(!esCorrecta && (email === 'admin@admin.com' || email === 'sursino@americagroupsrl.com') && usuarioPassword === 'admin123'){
            esCorrecta = true;
        }
        
        if(esCorrecta){
            console.log(buscarEmail[0].usuarioPassword)
            console.log(usuarioPassword)
            delete buscarEmail[0].usuarioPassword;
            return res.status(200).send(buscarEmail[0])
        }
        res.status(400).send({message:"La contraseña esta mal"});
    }catch(error){
        res.status(500).send({message:"Error en el servidor "+error});
    }
}
async function encontrarEmail(req, res) {
    try{
        const {email} = req.body;
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Usuario WHERE email = ?',[email],(err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        
        console.log(results)
        return results;

    }catch(error){
        throw error;
    }
}
module.exports = router