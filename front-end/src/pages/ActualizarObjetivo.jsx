import axios from "axios";
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/ActualizarObjetivo.css';
import { formatearFechaToISO } from "../components/fechaHoy.js";
import MensajeConfirmacion from '../components/MensajeConfirmacion.jsx';
import Confirmacion from '../components/Confirmacion.jsx';
import { getApiUrl } from '../config/configURL.js';

function ActualizarObjetivo(){
    const url = getApiUrl();
    const [objetivoData, setObjetivoData] = useState(null);
    const {id} = useParams();
    const [error, setError] = useState("");
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [contador, setContador] = useState(3);
    const [redirigir, setRedirigir] = useState(false);

    useEffect(()=>{
        axios.get(`${url}/api/objetivos/${id}`)
        .then(response => {
            console.log(response)
            const data = response.data;
            const fechaIncioISO = formatearFechaToISO(data.fechaInicio);
            const fechaFinalISO = formatearFechaToISO(data.fechaFinal);
            setObjetivoData({
                ...data,
                fechaInicio: fechaIncioISO,
                fechaFinal: fechaFinalISO,
            });
        })
        .catch(error => {
            setError(error.message);
        });
    },[id, formatearFechaToISO]);

    useEffect(()=>{
        if (contador > 0 && mostrarMensaje && !error) {
            // Si el contador es mayor que 0, configura un intervalo para restar 1 cada segundo
            const timer = setTimeout(() => {
              setContador(contador - 1);
            }, 1000);
      
            return () => clearTimeout(timer); // Limpia el timeout al desmontar el componente
          } else if(contador === 0) {
            // Cuando el contador llega a 0, activa la redirección
            setRedirigir(true);
          }
      
    },[mostrarMensaje,contador])

    if (redirigir) {
        return <Navigate to="/panel" />;
    }
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Manejar los cambios en los campos de usuario
        if (name === 'titulo' || name === 'descripcion' || name === 'peso' || name === 'fechaInicio' || name === 'fechaFinal') {
          setObjetivoData({
            ...objetivoData,
            [name]: value, // Actualiza solo la propiedad modificada en usuarioData
          });
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Aquí podrías hacer una llamada a la API para actualizar los datos
        try {
            const data = {
                titulo: objetivoData.titulo,
                descripcion: objetivoData.descripcion,
                peso: objetivoData.peso,
                fechaInicio: objetivoData.fechaInicio,
                fechaFinal: objetivoData.fechaFinal,
                idObjetivo: id,
            }
            
            const response = await axios.put(`${url}/api/objetivos/`, data);
       
            if(response.status === 200){
                console.log(response)
                
                setMostrarMensaje(true);

            }
        }catch (error) {
            setMostrarMensaje(false);
            if(error.response){
                setError(error.response.data.message || 'Ocurrió un error en el servidor');
            }else if(error.request){
                setError('No se recibio respuesta del servidor');
            }else{
                setError('Error en la configuracion de la solicitud: '+ error.message);
            }
        } 
    }
    return (
        <div className='form-contenedor-actualizar-objetivo'>
            {objetivoData ? (
                <form onSubmit={handleSubmit} >
                    <h1 className="titulo-puntuacion">Actualizar campos del Objetivo</h1>
                    {mostrarMensaje && <MensajeConfirmacion titulo={`Campos actualizados del objetivo con exito. Regresando en ${contador} segundos.`} tipo={'exito'}/> }
                    {error && <MensajeConfirmacion titulo={error} tipo={'error'}/>}
                    <div className='contenedor-input'>
                        <label>Titulo:</label>
                        
                        <input
                            className='input-datos-actualizar-obj'
                            type="text"
                            name="titulo"
                            value={objetivoData.titulo}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='contenedor-input'>
                        <label className="descripcion-label" htmlFor="texto">Descripcion del objetivo: (Máximo de caracteres: {objetivoData.descripcion.length}/{2500})</label>
                        <textarea
                            className="text-datos-actualizar-obj"
                            name="descripcion"
                            maxLength={2500}    
                            value={objetivoData.descripcion}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaInicio"> Fecha de inicio: </label>
                        <input
                            className='input-dates-actualizar-obj'
                            type="date"
                            name="fechaInicio"
                            value={objetivoData.fechaInicio}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="fechaFinal"> Fecha de final: </label>
                        <input
                            className='input-dates-actualizar-obj'
                            type="date"
                          
                            name="fechaFinal"
                            value={objetivoData.fechaFinal}
                            min={objetivoData.fechaInicio}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="contenedor-input">
                        <label htmlFor="slider" className="descripcion-label">Asigne el peso del objetivo: </label>
                        <input 
                            className='input-datos-actualizar-obj'
                            type="range"
                            name="peso"
                            min="0"
                            max="100"
                            value={objetivoData.peso}
                            onChange={handleInputChange}
                        />
                        <label>{objetivoData.peso}%</label>
                        </div>
                    <button className='button-datos' type="submit">Guardar</button>
                    <Confirmacion idElemento={id} tipo={'objetivo'}/>
                </form>    
            ):(
                <p>No se cargaron los datos...</p>
            )}
            
        </div>
      );
}

export default ActualizarObjetivo;