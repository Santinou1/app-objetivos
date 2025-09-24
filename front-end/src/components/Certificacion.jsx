import { useNavigate } from "react-router-dom";
function Certificacion({certificacion}){
    const nav = useNavigate();
        const handleClick = (tipo)=>{
           if(tipo === 'asignacion'){
            nav(`/asignar-certificacion/${certificacion.idCertificacion}`);
           }
           if(tipo === 'actualizar'){
            nav(`/actualizar-certificacion/${certificacion.idCertificacion}`);
           }
            
        }
    return(
        <div className="contenedor-objetivo">
            <div className="cabecera-objetivo">
                <h2 className="titulo-del-objetivo">{certificacion.nombreCertificacion}</h2>
                <p className="fechas-objetivo">Marca: {certificacion.marca}</p>
                <p className="fechas-objetivo">Año: {certificacion.anio}</p>
                <div className="contenedor-botones-panel">
                    <button className='botones-panel'  onClick={()=>handleClick('asignacion')} >Asignar personas</button>
                    <button className='botones-panel' onClick={()=>handleClick('actualizar')}>Modificar certificacion</button>
                </div>
            </div>
            <hr className="linea-objetivo"></hr>
 
            <p>Link del examen:  
                <a href={certificacion.url} target="_blank" rel="noopener noreferrer">
                {' '+certificacion.url}</a>
            </p>
        </div>
    );
}

export default Certificacion;