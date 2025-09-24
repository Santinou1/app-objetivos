import React, { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config/configURL.js';

function SubirArchivos({ puntuacion, onArchivoSubido, tipo }) {
    const [archivos, setArchivos] = useState([]);
    const url = getApiUrl();

    const handleAgregarArchivos = (event) => {
        const nuevosArchivos = Array.from(event.target.files);
        setArchivos(nuevosArchivos); // Solo mantenemos la selección más reciente
    };

    const handleSubirArchivos = async () => {
        const formData = new FormData();
        archivos.forEach((archivo) => {
            formData.append('archivo', archivo); // Usa la clave 'archivo' para todos los archivos
        });

        try {
            const response = await axios.post(`${url}/api/${tipo}/${puntuacion}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Archivos subidos con éxito');
                setArchivos([]); // Limpia la lista después de subir
                onArchivoSubido();
            } else {
                alert('Error al subir los archivos');
            }
        } catch (error) {
            console.error('Error al subir los archivos:', error);
            alert('Error al subir los archivos');
        }
    };

    return (
        <div className='subir-archivos'>
           
            {/* Botón para agregar archivos */}
            <input type="file"  className='boton-subir-archivos' multiple onChange={handleAgregarArchivos} />

            {/* Botón para subir todos los archivos */}
            <button 
                className={`boton ${archivos.length === 0 ? 'boton-desactivado' : 'boton-subir-archivos'}`}
                onClick={handleSubirArchivos} 
                disabled={archivos.length === 0}>
                Subir archivos
            </button>
        </div>
    );
}

export default SubirArchivos;