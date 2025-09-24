import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { obtenerFecha } from "../components/fechaHoy";
import axios from "axios";
import '../styles/AsignarObjetivo.css';
import { getApiUrl } from "../config/configURL";
function AsignarCertificacion(){
    const url = getApiUrl();
    const {id} = useParams();
    const [certificacion, setCertificacion] = useState(null);
    const [empleados, setEmpleados] = useState([]);
    const fechaMostrar = obtenerFecha();
    const [redirect, setRedirect] = useState(false);
    const [error, setError]  =useState(null);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [fechaLimite, setFechaLimite] = useState('');
    const [observaciones, setObservaciones] = useState('');
    useEffect(()=>{
        axios.get(`${url}/api/certificaciones/${id}`)
            .then( response => {
                console.log(response)
                setCertificacion(response.data);
            })
            .catch( error => {
                setError(error.message);
            });
        axios.get(`${url}/api/empleados`)
            .then( response => {
                console.log(response)
                
                setEmpleados(response.data.filter(empleado => empleado.activo));
            })
            .catch( error => {
                setError(error.message);
            });
            
    },[])
    const onSubmit =  async (e)=>{
        e.preventDefault();
        try{
           
            const data = {
                fechaLimite: fechaLimite,
                empleado: idEmpleado,
                certificado: parseInt(id),
                observaciones: observaciones,
                estado: 'pendiente'
            }
            const response = await axios.post(`${url}/api/certificacionasignacion/`, data);

            if(response.status === 200){
                setRedirect(true);
            }
        }catch(err){
           if(err.response){
            setError(err.response.data.message || 'Ocurrió un error en el servidor');
           }else if(err.request){
            setError('No se recibio respuesta del servidor');
           }else{
            setError('Error en la configuracion de la solicitud: '+ err.message);
           }
        }
    }
    if (redirect) {
        return <Navigate to={`/redireccion/asignado-certificacion/${id}`} />;
    }
    return(
        <div>
            {
                certificacion && empleados ? (
                    <div className="objetivo-container">
                        <form className="form-asignar-objetivo" onSubmit={onSubmit}>
                            <h1>Certificación: {certificacion.nombreCertificacion}</h1>
                            {error && <div style={{color:"red"}}>{error}</div>}
                            <div style={{display:"flex", gap:"4px"}}>
                                <label><b>Link de examen:</b></label>
                                <a href={certificacion.url} target="_blank" rel="noopener noreferrer">Abrir</a>
                            </div>
                            <div style={{display:"flex", gap:"4px",marginTop:"15px"}}>
                                <label><b>Marca:</b></label>
                                <label>{certificacion.marca}</label>
                            </div>
                            <div style={{display:"flex", gap:"4px",marginTop:"15px"}}>
                                <label><b>Año:</b></label>
                                <label>{certificacion.anio}</label>
                            </div>
                            <h4>Fecha de asignación de hoy: {fechaMostrar}</h4>
                            <label className="descripcion-label" htmlFor="texto">Observaciones: (Máximo de caracteres: {observaciones.length}/{400})</label>
                            <textarea
                                type="text"
                                id="texto"
                                className="text-area"
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                maxLength={400}    
                            />
                            <div className="contenedor-input">
                                <label  className="descripcion-label" htmlFor="fechaInicio"> Fecha limite: </label>
                                <input
                                    className="input-objetivo-nuevo"
                                    type="date"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    value={fechaLimite}
                                    onChange={(e) => setFechaLimite(e.target.value)}
                                    required
                                />
                            </div>
                            <label>Empleado:</label>
                    
                            <select className='select-form asignar' value={idEmpleado} onChange={(e)=>setIdEmpleado(e.target.value)} required>
                                <option value="" >Elige un empleado</option>
                                    {empleados.map(empleado =>(
                                        <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                                            {empleado.nombre}
                                        </option>
                                    ))}
                            </select>
                            <button type="submit" className='boton-asignar-objetivo'>Asignar</button>
                        </form>
                    </div>
                ):(
                    <div>
                        {error}
                    </div>
                )
            }
        </div>
    );
    
}

export default AsignarCertificacion;