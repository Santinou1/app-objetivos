import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Confirmacion from '../components/Confirmacion.jsx';
import { getApiUrl } from '../config/configURL.js';
import { formatearISOtoFecha } from '../components/fechaHoy.js';
import ArchivoAdjuntados from '../components/ArchivosAdjuntados.jsx';
import SubirArchivos from '../components/SubirArchivos.jsx';
function CertificacionEmpleado(){
    const url = getApiUrl();
    const [vuelta, setVuelta] = useState(false);
    const {asignacion, empleado, certificacion} = useParams();
    const [getEmpleado, setGetEmpleado] = useState(null);
    const [getCertificacion, setGetCertificacion] = useState(null);
    const [getAsignacion, setGetAsignacion]= useState(null);
    const [error, setError] = useState(null);
    const [actualizar, setActualizar] = useState(false);
    const [archivos, setArchivos] = useState([]);
    const volver = () =>{
        setVuelta(true);
    }
    const actualizarEstado = () =>{
        setActualizar(true);
    }
    const actualizarArchivos = () => {
        axios.get(`${url}/api/archivosCertificacion/${asignacion}`)
            .then(response => {
                setArchivos(response.data);
            })
            .catch(error => {
                setError(error.message);
            });
    };
    useEffect(()=>{
        axios.get(`${url}/api/empleados/${empleado}`)
            .then( response => {
                console.log(response)
                setGetEmpleado(response.data);
         
            })
            .catch( error => {
                setError(error.message);     
            });
        axios.get(`${url}/api/certificaciones/${certificacion}`)
            .then( response => {
                console.log(response)
                setGetCertificacion(response.data);
        
            })
            .catch( error => {
                setError(error.message);     
            });
        axios.get(`${url}/api/certificacionasignacion/certificado-empleado/${asignacion}`)
            .then( response => {
                console.log(response)
                setGetAsignacion(response.data[0]);
        
            })
            .catch( error => {
                setError(error.message);     
            });
        axios.get(`${url}/api/archivosCertificacion/${asignacion}`)
            .then( response => {
                console.log(response)
                setArchivos(response.data);
        
            })
            .catch( error => {
                setError(error.message);
            });
    },[]);

    if(vuelta){
        return <Navigate to={`/feed/certificaciones/${empleado}`}></Navigate>
    }
    if(actualizar){
        return <Navigate to={`/actualizar-estado-certificacion/${asignacion}/${empleado}/${certificacion}`}></Navigate>
    }
    return(
        <div className="container-objetivo-empleado"> 
            <div className='cuadrado'>
                {
                    getEmpleado && getCertificacion && getAsignacion? (<>
                    <div className='contenedor-fecha-boton'>
                            <h3>Progreso de {getEmpleado.nombre} en {getCertificacion.nombreCertificacion}</h3>
                            <button onClick={volver}> Volver</button>
                    </div>
                    <hr className='linea'></hr>
                    <div className='contenedor-fecha-boton'>
                        <h3>Nota: {getAsignacion.nota ? getAsignacion.nota : 'Sin nota' }</h3>
                        <h3>Estado: {getAsignacion.estado}</h3>
                        <div className='contenedor-botones'>
                            <div className='boton-rojo'>
                                <button onClick={actualizarEstado}>Actualizar estado</button>
                            </div>
                        </div>
                    </div>
                    <div className='contenedor-fecha-boton'>
                        <h3>Fecha Limite: {formatearISOtoFecha(getAsignacion.fechaLimite)}</h3>
                        <h3>Fecha Asignada: {formatearISOtoFecha(getAsignacion.fechaAsignada)}</h3>
                        <div className='contenedor-botones'>
                            <div className='boton-rojo'>
                                <Confirmacion idElemento={asignacion} idEmpleado={empleado} tipo={'asignacion certificacion'}/>
                            </div>
                        </div>
                    </div>
                    
                    <h3>Observaciones:</h3>
                    <label>{getAsignacion.observaciones ? getAsignacion.observaciones : 'No hay observaciones.' }</label>
                    </>): null    
                }
                <h3>Archivos adjuntados:</h3>

                <ArchivoAdjuntados archivos={archivos} tipo={'archivosCertificacion'} puntuacion={asignacion}/>
                <SubirArchivos puntuacion={asignacion} tipo={'archivosCertificacion'} onArchivoSubido={actualizarArchivos}/>
            </div>
        </div>
    );
}

export default CertificacionEmpleado;