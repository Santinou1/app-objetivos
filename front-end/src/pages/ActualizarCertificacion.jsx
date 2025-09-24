import { useState, useEffect } from "react";
import "../styles/ObjetivoNuevos.css";
import { Navigate, useParams } from "react-router-dom";
import { getApiUrl } from "../config/configURL";
import axios from "axios";
import Confirmacion from "../components/Confirmacion";
function ActualizarCertificacion() {
    const { id } = useParams();
    const [marcas, setMarcas] = useState([]);
    const [marca, setMarca] = useState('');
    const [nombreCertificacion, setNombreCertificacion] = useState('');
    const [url, setUrl] = useState('');
    const [anio, setAnio] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        axios.get(`${getApiUrl()}/api/certificaciones/marcas`)
            .then(response => {
                setMarcas(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${getApiUrl()}/api/certificaciones/${id}`)
            .then(response => {
                const data = response.data;
                console.log(data);
                setNombreCertificacion(data.nombreCertificacion);
                setMarca(data.marca);
                setUrl(data.url);
                setAnio(data.anio);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const data = {
            nombreCertificacion,
            marca,
            url,
            anio
        };

        axios.put(`${getApiUrl()}/api/certificaciones/${id}`, data)
            .then((response) => {
                if (response.status === 200) {
                    setRedirect(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    if (redirect) {
        return <Navigate to="/certificaciones" />;
    }

    return (
        <div className="objetivo-container">
            <form className="form-objetivo" onSubmit={onSubmit}>
                <h1 className="titulo-puntuacion">Actualizar Certificación</h1>
                <div className="contenedor-input">
                    <label className="label-form">Título:</label>
                    <input 
                        type="text" 
                        className="input-objetivo-nuevo" 
                        value={nombreCertificacion} 
                        onChange={(e) => setNombreCertificacion(e.target.value)}
                    />
                </div>
                <div className="contenedor-input">
                    <label htmlFor="marca"> Marca: </label>
                    <select name="marca" className="input-select" value={marca} onChange={(e) => setMarca(e.target.value)}>
                        <option value=''>Seleccione una marca</option>
                        {marcas.map((marca, index) => (
                            <option key={index} value={marca.nombreMarca}>{marca.nombreMarca}</option>
                        ))}
                    </select>
                </div>
                <div className="contenedor-input">
                    <label className="label-form">Link de examen:</label>
                    <input 
                        type="text" 
                        className="input-objetivo-nuevo" 
                        value={url} 
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <div className="contenedor-input">
                    <label className="label-form">Año:</label>
                    <input 
                        type="number" 
                        className="input-objetivo-nuevo" 
                        value={anio} 
                        onChange={(e) => setAnio(e.target.value)}
                    />
                </div>
                <button className="boton-agregar" type="submit">Actualizar</button>
                <Confirmacion tipo={'certificacion'} idElemento={id}/>
            </form>
        </div>
    );
}

export default ActualizarCertificacion;
