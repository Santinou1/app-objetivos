import { useState, useEffect} from "react";
import "../styles/ObjetivoNuevos.css";
import { Navigate } from "react-router-dom";
import { getApiUrl } from "../config/configURL";
import axios from "axios";
function NuevaCertificacion(){
    const [marcas, setMarcas] = useState([]);
    const [marca, setMarca] = useState('');
    const [nombreCertificacion, setNombreCertificacion] = useState('');
    const [url, setUrl] = useState('');
    const [anio, setAnio] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        axios.get(`${getApiUrl()}/api/certificaciones/marcas`)
            .then(response => {
                setMarcas(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    },[]);
    const onsubmit = (e) =>{
        e.preventDefault();
        const data = {
            nombreCertificacion: nombreCertificacion,
            marca: marca,
            url: url,
            anio: anio
        }
        
            axios.post(`${getApiUrl()}/api/certificaciones`, data).then((response)=>{
                if(response.status === 200){
                    setRedirect(true);
                }
            }).catch(error => {
                console.log(error);
            });
      
    }
    
    if(redirect){
        return <Navigate to="/redireccion/certificacion"/>
    }
    return(
        <div className="objetivo-container">
            <form className="form-objetivo" onSubmit={onsubmit}>
                <h1  className="titulo-puntuacion">Agregar objetivo</h1>
                <div className="contenedor-input">
                    <label className="label-form">Título:</label>
                    <input 
                        type="text" 
                        className="input-objetivo-nuevo" 
                        value={nombreCertificacion} 
                        onChange={(e)=>setNombreCertificacion(e.target.value)}/>
                </div>
                <div className="contenedor-input">
                    <label htmlFor="fechaFinal"> Marca: </label>

                    <select name="marca" className="input-select" value={marca} onChange={(e)=>setMarca(e.target.value)}>
                        <option value=''>Seleccione una marca</option>
                        {
                            marcas.map((marca, index) => {
                                return (
                                    <option key={index} value={marca.nombreMarca}>{marca.nombreMarca}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="contenedor-input">
                    <label className="label-form">Link de examen:</label>
                    <input type="text" className="input-objetivo-nuevo" value={url} onChange={(e)=>setUrl(e.target.value)}/>
                </div>
                <div className="contenedor-input">
                    <label className="label-form">Año:</label>
                    <input type="number" className="input-objetivo-nuevo" value={anio} onChange={(e)=>setAnio(e.target.value)}></input>
                </div>
                <button className="boton-agregar" type="submit">Agregar</button>
            </form>
            
        </div>
    )
}

export default NuevaCertificacion;