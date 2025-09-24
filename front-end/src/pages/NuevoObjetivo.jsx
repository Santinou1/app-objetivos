import { usePageTitle } from "../components/nombrePag";
import { useState } from "react";
import "../styles/ObjetivoNuevos.css";
import { Navigate } from "react-router-dom";
import { getApiUrl } from "../config/configURL";
function NuevoObjetivo(){
    usePageTitle('Home | Medicion de objetos')
    const url = getApiUrl();
    const [texto, setTexto] = useState("");
    const [puntuacion, setPuntuacion] = useState(0);
    const [titulo, setTitulo] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [redirect, setRedirect] = useState(false);

    // Función para manejar el envío del formulario
    const manejarEnvio = async (e) => {
        e.preventDefault();
        // Aquí puedes procesar los valores del formulario

        const formulario = {
            idObjetivo: 0,
            titulo: titulo,
            descripcion: texto,
            peso: puntuacion,
            fechaInicio: fechaInicio,
            fechaFinal: fechaFinal,
        }
        
        try{
            const response = await fetch(`${url}/api/objetivos`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formulario),
            });

            if(!response.ok){
                throw new Error('Error en la soclicitud');
            }

            
            

            setFechaFinal('');
            setFechaInicio('');
            setPuntuacion(0);
            setTexto('');
            setTitulo('');

            
            if(response.ok) {
                setRedirect(true); 
            }

            
        } catch (error){
            console.log('Error al enviar datos', error);
        }
    };

    if (redirect) {
        return <Navigate to='/redireccion/objetivo' />;
    }

    return (
        <div className="objetivo-container">
        
            <form className="form-objetivo" onSubmit={manejarEnvio}>
                <h1  className="titulo-puntuacion">Agregar objetivo</h1>
                
                <div className="contenedor-input">
                    <label className="label-form">Título</label>
                    <input type="text" className="input-objetivo-nuevo" value={titulo} onChange={(e)=> setTitulo(e.target.value)}></input>
                </div>

                <div className="contenedor-input">
                    <label className="descripcion-label" htmlFor="texto">Descripcion del objetivo: (Máximo de caracteres: {texto.length}/{2500})</label>
                    <textarea
                        type="text"
                        id="texto"
                        className="text-area"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        maxLength={2500}    
                    />
                </div>
        <div className="contenedor-input">
            <label htmlFor="fechaInicio"> Fecha de inicio: </label>
            <input
                className="input-objetivo-nuevo"
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
            />
        </div>
        <div className="contenedor-input">
            <label htmlFor="fechaFinal"> Fecha de final: </label>
            <input
                type="date"
                id="fechaFinal"
                name="fechaFinal"
                className="input-objetivo-nuevo"
                value={fechaFinal}
                min={fechaInicio}
                onChange={(e) => setFechaFinal(e.target.value)}
                required
            />
        </div>
        
        <div className="contenedor-input">
            <label htmlFor="slider" className="descripcion-label">Asigne el peso del objetivo: </label>
            <input 
                className="input-objetivo-nuevo"
                type="range"
                id="puntuacion"
                min="0"
                max="100"
                value={puntuacion}
                onChange={(e)=>setPuntuacion(e.target.value)}
            />
            <label>{puntuacion}%</label>
        </div>
        <button className="boton-agregar" type="submit">Agregar</button>
        </form>
        </div>
        
    );

}
export default NuevoObjetivo;