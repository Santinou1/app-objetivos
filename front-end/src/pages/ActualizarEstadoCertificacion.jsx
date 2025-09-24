import { getApiUrl } from '../config/configURL';
import { Navigate, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatearISOtoFecha } from '../components/fechaHoy.js';
 
function ActualizarEstadoCertificacion() {
    const url = getApiUrl();
    const { asignacion, empleado, certificacion } = useParams();
    const [getEmpleado, setGetEmpleado] = useState(null);
    const [getCertificacion, setGetCertificacion] = useState(null);
    const [getAsignacion, setGetAsignacion] = useState(null);
    const [redireccion, setRedireccion] = useState(false);
    const [estado, setEstado] = useState('');
    const [fechaLimite, setFechaLimite] = useState('');
    const [error, setError] = useState(null);
    const [observaciones, setObservaciones] = useState('');
    const [nota, setNota] = useState(0);
    const [loading, setLoading] = useState(true); // Estado de carga
 
    useEffect(() => {
        // Realizar todas las peticiones al mismo tiempo usando Promise.all
        const fetchData = async () => {
            try {
                setLoading(true); // Empieza la carga
                const [empleadoResponse, certificacionResponse, asignacionResponse] = await Promise.all([
                    axios.get(`${url}/api/empleados/${empleado}`),
                    axios.get(`${url}/api/certificaciones/${certificacion}`),
                    axios.get(`${url}/api/certificacionasignacion/certificado-empleado/${asignacion}`)
                ]);
               
                setGetEmpleado(empleadoResponse.data);
                setGetCertificacion(certificacionResponse.data);
                const asignacionData = asignacionResponse.data[0];
                setGetAsignacion(asignacionData);
                setEstado(asignacionData.estado);
                setFechaLimite(asignacionData.fechaLimite.split("T")[0]);
                setObservaciones(asignacionData.observaciones);
                setNota(asignacionData.nota);
                setLoading(false); // Fin de la carga
            } catch (error) {
                setError('Error al cargar los datos');
                setLoading(false); // Fin de la carga incluso si hay error
            }
        };
        fetchData();
    }, [empleado, certificacion, asignacion]);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                estado,
                nota,
                observaciones,
                fechaLimite,
            };
            const response = await axios.put(`${url}/api/certificacionasignacion/${asignacion}`, data);
            if (response.status === 200) {
                setRedireccion(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ocurrió un error en el servidor');
        }
    };
 
    if (redireccion) {
        return <Navigate to={`/certificacion-empleado/${asignacion}/${empleado}/${certificacion}`} />;
    }
 
    return (
        <div className="conetendor-puntuacion-actualizar">
            {loading ? (
                <h2>Cargando...</h2> // Mensaje de carga mientras se traen los datos
            ) : error ? (
                <h1>{error}</h1> // Mensaje de error si las peticiones fallan
            ) : (
                <form className="contenedor-actualizar">
                    <h1 className="titulo-puntuacion">Actualizar estado de certificación</h1>
                    <h3>Certificación: {getCertificacion.nombreCertificacion}</h3>
                    <h3>Empleado: {getEmpleado.nombre}</h3>
                    <h3>Fecha asignada: {formatearISOtoFecha(getAsignacion.fechaAsignada)}</h3>
                    <label className='descripcion-label'>Fecha Limite:</label>
                    <input
                        className="input-objetivo-nuevo"
                        type="date"
                        value={fechaLimite}
                        onChange={(e) => setFechaLimite(e.target.value)}
                        required
                    />
                    <label className="descripcion-label">Observaciones: (Máximo de caracteres: {observaciones.length}/{400})</label>
                    <textarea
                        placeholder='Escribe un comentario o puede dejarlo vacío...'
                        className="text-datos-actualizar-obj"
                        maxLength={400}
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                    />
                    <label className='descripcion-label'>Nota: (0-100)</label>
                    <input
                        className="input-objetivo-nuevo"
                        type="number"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        required
                        max={100}
                        min={0}
                    />
                    <label className='descripcion-label'>Estado:</label>
                    <select
                        className="input-select"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                    >
                        <option value=''>Seleccione un estado</option>
                        <option value='pendiente'>Pendiente</option>
                        <option value='aprobado'>Aprobado</option>
                        <option value='deprobado'>Reprobado</option>
                    </select>
                    <button className='actualizar-puntuacion-boton' onClick={handleSubmit}>Actualizar estado</button>
                </form>
            )}
        </div>
    );
}
 
export default ActualizarEstadoCertificacion;