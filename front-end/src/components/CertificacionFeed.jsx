import { useUserContext} from "../UserProvider.jsx";
import { useState } from "react";
import { Navigate } from "react-router-dom";
function CertificacionFeed({certificacion,empleado,certificacionAsignacion}){
    const {user} = useUserContext();
    const [redireccion,setRedireccion]= useState(false);
    
    if(redireccion){
            return <Navigate to={`/certificacion-empleado/${certificacionAsignacion}/${empleado}/${certificacion.idCertificacion}`} />
        }
    return(
        <div className="contenedor-objetivo">
            <div className="cabecera-objetivo">
                <h2 className="titulo-del-objetivo">{certificacion.nombreCertificacion}</h2>
                <p className="fechas-objetivo">Marca: {certificacion.marca}</p>
                <p className="fechas-objetivo">Año: {certificacion.anio}</p>
                {
                    user && user.rol === 'admin' ? (
                        <div className="contenedor-boton-feed">
                            <button className='botones-panel' onClick={()=>{setRedireccion(true)}} >Ver mas detalles</button>
                        </div>            
                    ) : (
                        <></>
                    )
                }
            </div>
            <hr className="linea-objetivo"></hr>
            <p>Link del examen:<a href={certificacion.url} target="_blank" rel="noopener noreferrer">
            {' '+certificacion.url}</a></p>
        </div>

    );

}

export default CertificacionFeed;