import React from "react";
import "../styles/Objetivo.css"
import { useNavigate } from "react-router-dom";

function ObjetivoPanel(props){
    const nav = useNavigate();
    const handleClick = (tipo)=>{
       if(tipo === 'asignacion'){
        nav(`/asignar-objetivo/${props.objetivo.idObjetivo}`);
       }
       if(tipo === 'actualizar'){
        nav(`/actualizar-objetivo/${props.objetivo.idObjetivo}`);
       }
        
    }
    return (

        <div className="contenedor-objetivo">
            <div className="cabecera-objetivo">
                <h2 className="titulo-del-objetivo">{props.objetivo.titulo}</h2>
                <p className="fechas-objetivo">Fecha de inicio: {props.objetivo.fechaInicio}</p>
                <p className="fechas-objetivo">Fecha final: {props.objetivo.fechaFinal}</p>
                <div className="contenedor-botones-panel">
                    <button className='botones-panel' onClick={()=>handleClick('asignacion')}>Asignar personas</button>
                    <button className='botones-panel' onClick={()=>handleClick('actualizar')}>Modificar Objetivo</button>
                </div>
                
            </div>
            <hr className="linea-objetivo"></hr>
 
            <p>Descripcion: {props.objetivo.descripcion}</p>
                       
            <div className="contenedor-progreso">
                <p className="peso-p">Peso: </p>
                <progress id="progreso "value={props.objetivo.peso} max="100"></progress>
                <label htmlFor="progreso">{props.objetivo.peso}%</label>
            </div>
          
            
        </div>
    );
}
export default ObjetivoPanel;