const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../certificaciones'));  // Carpeta para archivos de certificaciones
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/:id', upload.array('archivo'), subirArchivoCertificacion);
router.get('/:id', obtenerArchivosCertificacion);
router.delete('/:id', eliminarArchivoCertificacion);
router.get('/descargar/:id', descargarArchivoCertificacion);

async function subirArchivoCertificacion(req, res) {
    try {
        const certificacion = req.params.id;
        const archivos = req.files;

        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });
        
        const query = 'INSERT INTO ArchivoCertificacion (certificacion, nombre, ruta) VALUES (?, ?, ?)';
        for (const archivo of archivos) {
            const nombreArchivo = archivo.originalname;
            const rutaArchivo = archivo.path;

            await new Promise((resolve, reject) => {
                connection.query(query, [certificacion, nombreArchivo, rutaArchivo], (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
        }

        res.status(200).json({ mensaje: 'Archivo de certificación subido y guardado con éxito' });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function obtenerArchivosCertificacion(req, res) {
    try {
        const certificacion = req.params.id;
        
        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });
        
        const results = await new Promise((resolve, reject) => {
            connection.query('SELECT nombre, idArchivoCertificacion FROM ArchivoCertificacion WHERE certificacion = ?', [certificacion], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ mensaje: error });
    }
}

async function descargarArchivoCertificacion(req, res) {
    try {
        const id = req.params.id;

        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });
        
        const result = await new Promise((resolve, reject) => {
            connection.query('SELECT ruta, nombre FROM ArchivoCertificacion WHERE idArchivoCertificacion = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        if (!result) {
            return res.status(404).json({ mensaje: 'Archivo no encontrado' });
        }
        
        const filePath = path.resolve(result.ruta);
        const nombreVisible = result.nombre;
        res.download(filePath, nombreVisible, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                res.status(500).json({ mensaje: 'Error al descargar el archivo' });
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

async function eliminarArchivoCertificacion(req, res) {
    try {
        const id = req.params.id;

        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });
        
        const resultado = await new Promise((resolve, reject) => {
            connection.query('SELECT ruta FROM ArchivoCertificacion WHERE idArchivoCertificacion = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: 'Archivo no encontrado' });
        }
        
        const rutaArchivo = resultado[0].ruta;
        fs.unlink(rutaArchivo, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
                return res.status(500).json({ mensaje: 'Error al eliminar el archivo' });
            }

            const deleteQuery = 'DELETE FROM ArchivoCertificacion WHERE idArchivoCertificacion = ?';
            connection.query(deleteQuery, [id], (error, results) => {
                if (error) {
                    console.error('Error al eliminar el registro de la base de datos:', error);
                    return res.status(500).json({ mensaje: 'Error al eliminar el archivo de la base de datos' });
                }

                res.status(200).json({ mensaje: 'Archivo de certificación eliminado exitosamente' });
            });
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = router;
