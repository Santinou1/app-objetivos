import React, { useEffect, useState } from 'react';
import SinElementos from './SinElementos.jsx';
import { getApiUrl } from '../config/configURL.js';

function ArchivoAdjuntados({ archivos ,puntuacion, onEliminarArchivo, tipo}){
    const url = getApiUrl()
    
    return(
        <div className='contenedor-archivos' >
            <h3>Archivos adjuntados:</h3>
            {archivos && archivos.length !== 0? (
                <>
                    
                    <ul>
                        {console.log('Archivos:',archivos)}
                        {archivos.map((archivo, index) => (
                        <li key={index}>
                            {
                                tipo === 'archivos'?<a href={`${url}/api/${tipo}/descargar/${archivo.idArchivo}`} download>
                                {archivo.nombre}
                                </a>:<a href={`${url}/api/${tipo}/descargar/${archivo.idArchivoCertificacion}`} download>
                            {archivo.nombre}
                            </a>
                            }
                            
                            {
                                tipo === 'archivos'?
                                <button
                                onClick={() => onEliminarArchivo(archivo.idArchivo,puntuacion)}
                                style={{ margin: '0px 0px 0px 10px', background: 'red', color: 'white', width:'auto', height:'auto' }}
                            >
                                    <b>x</b>
                            </button>: null
                            }
                            

                        </li>
                        ))}
                    </ul>
                </>
            ):
            (
                <SinElementos elemento={'archivos adjuntados.'} estilo={'puntuacion'}/>
            )}
        </div>
    );
}
export default ArchivoAdjuntados;