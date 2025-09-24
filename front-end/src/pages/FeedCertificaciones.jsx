import axios from 'axios';
import { useState, useEffect } from "react";
import { getApiUrl } from "../config/configURL";
import { useUserContext} from "../UserProvider";
import CertificacionFeed from '../components/CertificacionFeed';
import SinElementos from "../components/SinElementos";
import { useParams } from "react-router-dom";
function FeedCertificaciones(){
    const url = getApiUrl();
    const {id} = useParams();
    const {user} = useUserContext();
    const [empleado, setEmpleado] = useState(null);
    const [certificaciones, setCertificaciones] = useState([]);
    const [error, setError] = useState('');
    useEffect(()=>{
        axios.get(`${url}/api/empleados/${id}`)
            .then( response => {
                console.log(response)
                setEmpleado(response.data);
             
            })
            .catch( error => {
                setError(error.message);     
            });
        axios.get(`${url}/api/certificacionasignacion/${id}`)
            .then(response => {
                console.log(response)
                setCertificaciones(response.data);
                
            })
            .catch( error => {
                setError(error.message);
            })
        },[]);
    return(
        <>
            <h1 className="titulo">Certificaciones asignadas de {empleado?.nombre}</h1>
            <hr className="linea"></hr>
            {empleado && certificaciones && certificaciones.length !== 0 ?  (
                <>
                    
                    <ul className="lista">
                        {certificaciones.map((certificacion,index)=>(
                            <li key={index}>
                                <CertificacionFeed certificacion={certificacion} empleado={empleado.idEmpleado} certificacionAsignacion={certificacion.idCertificacionEmpleado}/>
                            </li>
                    ))}
                    </ul>
                </>
            ) : (<SinElementos elemento={'certificaciones asignadas.'}/>)}
        </>
    );
}

export default FeedCertificaciones;