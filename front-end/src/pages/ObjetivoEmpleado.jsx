import '../styles/ObjetivoEmpleado.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import Confirmacion from '../components/Confirmacion.jsx';
import { getApiUrl } from '../config/configURL.js';
import ArchivoAdjuntados from '../components/ArchivosAdjuntados.jsx';
import SubirArchivos from '../components/SubirArchivos.jsx';


function ObjetivoEmpleado(){
    const [trimestre, setTrimestre] = useState(0);
    const {asignacion, empleado, objetivo} = useParams();
    const [getObjetivo, setGetObjetivo]= useState(null);
    const [getEmpleado, setGetEmpleado] = useState(null);
    const [puntuacion, setPuntuacion] = useState(null);
    const [archivos, setArchivos] = useState([]);
    const url = getApiUrl();
    const [vuelta, setVuelta] = useState(false);
    const [actualizar, setActualizar] = useState(false);
    const [error,setError] = useState(null);
    const cargarArchivos = async (puntuacion) => {
        try {
            const response = await axios.get(`${url}/api/archivos/${puntuacion}`);
            console.log(response)
            setArchivos((prevArchivos) => ({
                ...prevArchivos,
                [puntuacion]: response.data
            }));
            console.log(archivos)
        } catch (error) {
            console.error('Error al cargar archivos:', error);
        }
    };
    const handleEliminarArchivo = async (archivoId,puntuacion) => {
        try {
            await axios.delete(`${url}/api/archivos/${archivoId}`);
            setArchivos((prevArchivos) => ({
                ...prevArchivos,
                [puntuacion]: prevArchivos[puntuacion].filter(
                    (archivo) => archivo.idArchivo !== archivoId
                )
            }));
            alert('Archivo eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el archivo:', error);
            alert('Error al eliminar el archivo');
        }
    };
    
    const handleArchivoSubido = (puntuacion) => {
        cargarArchivos(puntuacion); // Recargar archivos al subir uno nuevo
    };
    useEffect(() => {
        if (puntuacion) {
            puntuacion.forEach(punto => {
                cargarArchivos(punto.idPuntuacion); // Cargar archivos para cada puntuación
            });
        }
    }, [puntuacion]);
    useEffect(()=>{
        axios.get(`${url}/api/empleados/${empleado}`)
            .then( response => {
                console.log(response)
                setGetEmpleado(response.data);
             
            })
            .catch( error => {
                setError(error.message);     
            });
        axios.get(`${url}/api/objetivos/${objetivo}`)
            .then(response => {
                console.log(response)
                setGetObjetivo(response.data);
            })
            .catch( error => {
                setError(error.message);
            })
        axios.get(`${url}/api/puntuacion/${asignacion}`)
            .then(response => {
                console.log(response)
                setPuntuacion(response.data);
                let numeroDeTrimestres = response.data.length;
                setTrimestre(numeroDeTrimestres-1);
            })
            .catch( error => {
                setError(error.message);
            })
    },[]);

    const volver = () =>{
       setVuelta(true);
    }
    useEffect(()=>{
        console.log(archivos)
    },[archivos])
    const actualizarPuntuacion = () =>{
        setActualizar(true);
    }
    if(vuelta){
        return <Navigate to={`/feed/objetivos/${empleado}`}></Navigate>
    }
    if(actualizar){
        return <Navigate to={`/actualizar-puntuacion/${asignacion}/${empleado}/${objetivo}/${trimestre}`} ></Navigate>
    }
    return (
        <div className="container-objetivo-empleado">
            <div className='cuadrado'>
                {(getEmpleado && getObjetivo && puntuacion) && archivos ? (
                    <>
                        <div className='contenedor-fecha-boton'>
                            <h3>Progreso de {getObjetivo.titulo} de {getEmpleado.nombre}</h3>
                            <button onClick={volver}> Volver</button>
                        </div>
                        <hr className='linea'></hr>
                        <div className='contenedor-fecha-boton'>
                            <h3>Fecha final de objetivo: {getObjetivo.fechaFinal}</h3>
                            <div className='contenedor-botones'>
                                {trimestre === 5 ? <p>Trimestre: 4/4</p>
                                : <p>Puntuaciones trimestrales: {trimestre}/4</p>
                                }
                                
                                <button 
                                    className={`boton-obj-emp ${trimestre >= 4 ? 'boton-deshabilitado' : ''}`} 
                                    onClick={actualizarPuntuacion}  
                                    disabled={trimestre === 4}>
                                    Actualizar estado</button>
                                <div className='boton-rojo'>
                                <Confirmacion idElemento={asignacion} idEmpleado={empleado} tipo={'asignacion'}/>
                                </div>
                            </div>
                        </div>
                        <h3>Historial de {getEmpleado.nombre} en el objetivo:</h3>
                        <div className='contenedor-lista'>
                        <ul className='lista-puntuacion'>
                            {puntuacion.map((punto) => (
                                <li key={punto.idPuntuacion} className='contenedor-punto'>
                                    <ul className='lista-puntuacion'>
                                        <div style={{display:'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                            <div>
                                                <li>Fecha: {new Date(punto.fechaPuntuacion).toLocaleDateString()}</li>
                                                <li>Progreso: <progress value={punto.valor} max='100'></progress> {punto.valor}%</li>
                                                <li>Comentario: {punto.comentario ? <>{punto.comentario}</>:<>Sin comentarios</>}</li>
                                                <li>Trimestre: {punto.trimestre}°</li>
                                            </div>
                        
                                            <div style={{display:'flex', flexDirection:'row'}}>
                                                <SubirArchivos puntuacion={punto.idPuntuacion}  tipo={'archivos'} onArchivoSubido={()=>handleArchivoSubido(punto.idPuntuacion)}/>
                                            </div>
                                            
                                            </div> 
                                            <ArchivoAdjuntados puntuacion={punto.idPuntuacion} archivos={archivos[punto.idPuntuacion]}  tipo={'archivos'} onEliminarArchivo={handleEliminarArchivo} />
                                                                              
                                        <hr className='linea'></hr>                                       
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        </div>   
                    </>
                ):(
                    <></>
                )}
            </div>
        </div>
    );
}

export default ObjetivoEmpleado;