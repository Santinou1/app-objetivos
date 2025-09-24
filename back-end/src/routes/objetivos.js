const express = require('express');
const router = express.Router();
const {format, parseISO} = require('date-fns'); 

router.get('/', obtenerObjetivos);
router.get('/ultimo',obtenerUltimoObjetivo );
router.get('/:id', obtenerObjetivo);
router.post('/', agregarObjetivo);
router.put('/',actualizarObjetivo);
router.delete('/:id',eliminarObjetivo);


async function agregarObjetivo(req, res) {
 try{

    console.log(req.body);

    const { titulo, descripcion, peso, fechaInicio, fechaFinal} = req.body;

    if (!titulo || !descripcion || peso === undefined || !fechaInicio || !fechaFinal) {
        return res.status(400).send("Faltan datos necesarios");
    }

    const connection = await new Promise((resolve, reject)=>{
        req.getConnection((err, conn)=>{
            if(err) reject(err);
            else resolve(conn);
        });
    });

    const query = 'INSERT INTO Objetivo (titulo, descripcion, peso, fechaInicio, fechaFinal) VALUES (?,?,?,?,?)';
    const results = await new Promise((resolve, reject)=>{
        connection.query(query, [titulo,descripcion,peso,fechaInicio,fechaFinal], (err, results)=>{
            if(err) reject(err);
            else resolve(results);
        });
    });
    console.log(results);
    
    res.status(200).send('Objetivo agregado con exito.');
 }  catch (err){
    res.status(404).send(err);
 } 
}

async function actualizarObjetivo(req,res){
    try{
        const { idObjetivo, titulo, descripcion, peso, fechaInicio, fechaFinal } = req.body;

        // Verificar que todos los datos necesarios estén presentes
        if (!idObjetivo || !titulo || !descripcion || peso === undefined || !fechaInicio || !fechaFinal) {
        return res.status(400).send("Faltan datos necesarios");
        }

        // Crear la conexión a la base de datos
        const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) reject(err);
            else resolve(conn);
        });
        });

        // Consulta SQL para actualizar el registro
        const query = `
        UPDATE Objetivo 
        SET titulo = ?, descripcion = ?, peso = ?, fechaInicio = ?, fechaFinal = ?
        WHERE idObjetivo = ?
        `;

        // Ejecutar la consulta y actualizar el registro
        const results = await new Promise((resolve, reject) => {
        connection.query(query, [titulo, descripcion, peso, fechaInicio, fechaFinal, idObjetivo], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
        });

        // Verificar si se actualizó algún registro
        if (results.affectedRows === 0) {
        return res.status(404).send('No se encontró el objetivo con ese ID.');
        }
        res.send(results);
    }catch(error){
        res.status(500).send(error.message);
    }
}
async function obtenerObjetivos(req, res) {
    try{
        
        const connection = await new Promise((resolve, reject)=>{
            req.getConnection((err, conn)=>{
                if(err) reject(err);
                else resolve(conn);
            });
        });
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Objetivo', (err, results)=>{
                if(err) reject(err);
                else resolve(results);
            });
        });
        console.log(results)
        console.log(results[0]?.fechaFinal);
        const dataFormateado = formatearFecha(results)
        console.log(dataFormateado);
        //console.log(dataFormateado[0].fechaFinal);
        res.status(200).json(dataFormateado);
    } catch(err){
        res.send(err);
    }
}

async function obtenerUltimoObjetivo(req, res) {
    console.log('Entrando a la funcion');
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
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Objetivo ORDER BY idObjetivo DESC LIMIT 1 ', (err, results)=>{
                if(err){
                    console.error("Error en la consulta:", err);
                    reject(err);
                } 
                else{
                    resolve(results);
                }
            });
        });
        console.log(results);
        
        res.send(results[0]);
    } catch (err) {
        res.send(err);
    }
}

async function eliminarObjetivo(req, res){
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
        const idObjetivo = req.params.id;
        if(!idObjetivo){
            return res.status(400).send({message:'No se envio una id'});
        }
        const results = await new Promise((resolve,reject)=>{
            connection.query('DELETE FROM Objetivo WHERE idObjetivo = ?',[idObjetivo],(err, results)=>{
                if(err){
                    console.error("Error en la consulta:", err);
                    reject(err);
                } 
                else{
                    resolve(results);
                } 
            });
        });
        console.log(results);
        res.status(200).send("Objetivo eliminado correctamente.");
    } catch (error) {
        res.status(500).send(error);
    }
}

async function obtenerObjetivo(req, res) {
    const idObjetivo = req.params.id;
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
        const results = await new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM Objetivo WHERE idObjetivo = ?',[idObjetivo], (err, results)=>{
                if(err){
                    console.error("Error en la consulta:", err);
                    reject(err);
                } 
                else{
                    resolve(results);
                }
            });
        });
        console.log(results);
        const dataFormateado = formatearFecha(results)
        res.send(dataFormateado[0])
    } catch (err) {
        res.send(err);
    }
}

const formatearFecha = (objetivos)=>{
    let formateo = objetivos.map(objetivo => ({
        ...objetivo,
        fechaInicio: new Date(objetivo.fechaInicio),
        fechaFinal : new Date(objetivo.fechaFinal),
    }));
    return formateo.map(fecha => ({
        ...fecha,
        fechaInicio: format(fecha.fechaInicio,'dd/MM/yyyy'),
        fechaFinal: format(fecha.fechaFinal,'dd/MM/yyyy')
    }));
}
module.exports = router;