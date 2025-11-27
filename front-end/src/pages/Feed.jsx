import Objetivo from "../components/Objetivo";
import axios from 'axios';
import "../styles/Feed.css";
import SinElementos from "../components/SinElementos";
import { useUserContext} from "../UserProvider";
import { useState, useEffect } from "react";
import { generarColorAleatorio } from "../components/generarColorAleatorio";
import DesempenoTotal from "../components/DesempenoTotal";
import BotonPdfTrimestre from "../components/BotonPdfTrimestre";
import { getApiUrl } from "../config/configURL";
import Leyenda from "../components/Leyenda.jsx";
import GraficoObjetivos from "../components/GraficoObjetivos";
import TabsNavegacion from "../components/TabsNavegacion";
import { useParams, useLocation } from "react-router-dom";

function Feed(){
    const url = getApiUrl();
    const {user} = useUserContext();
    const {id} = useParams();
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const [objetivos, setObjetivos] = useState(null); 
    const [empleado, setEmpleado] = useState(null);
    const [colores, setColores] = useState([]);
    const [puntuaciones, setPuntuaciones] = useState(null);
    const [tabActiva, setTabActiva] = useState(location.state?.tabActiva || 'resumen');

    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);

    const [cargando, setCargando] = useState(false)

    const [error, setError] = useState('');

    const handleCambiarTab = (nuevaTab) => {
        setTabActiva(nuevaTab);
    };
    useEffect(()=>{
        axios.get(`${url}/api/empleados/${id}`)
            .then( response => {
                console.log(response)
                setEmpleado(response.data);
             
            })
            .catch( error => {
                setError(error.message);     
            });
        axios.get(`${url}/api/objetivoasignacion/${id}`)
            .then(response => {
                console.log(response)
                setObjetivos(response.data);
                setCargando(true)
            })
            .catch( error => {
                setError(error.message);
            })
        axios.get(`${url}/api/puntuacion/puntuacionBarra/${id}`)
            .then(response => {
                console.log(response)
                setPuntuaciones(response.data);
            })
            .catch( error => {
                setError(error.message);
            })

    },[id]);

    useEffect(()=>{
        if(cargando){
            const nuevosColores = objetivos.map(()=> generarColorAleatorio());
            setColores(nuevosColores);
        }
       
    },[objetivos]);
    

    return(
        <div id="main-content">
          
            {error && <p>Error : {error}</p>}
            {user && user.rol === 'admin' ? (<>
                <h1 className="titulo">Objetivos asignados de {empleado?.nombre}</h1>
                <hr className="linea"></hr>
                
            </>
            
            ) : (
                <>
                    <h2 className="titulo">Bienvenido, {empleado?.nombre}</h2>

                     <hr className="linea"></hr> 
                </>
            )}
           
            {user && user.rol === 'admin' && puntuaciones && objetivos ? (
                <>
                    <TabsNavegacion 
                        tabActiva={tabActiva} 
                        onCambiarTab={handleCambiarTab} 
                    />
                    
                    {tabActiva === 'resumen' && (
                        <div className="tab-content">
                            <DesempenoTotal objetivos={puntuaciones} />
                            
                            <div className="contenedor-leyendas">
                                <Leyenda 
                                    tituloLeyenda={'Barra de peso de los objetivos'}
                                    objetivos={objetivos} 
                                    colores={colores} 
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    hoveredIndex={hoveredIndex} 
                                />
                                <Leyenda 
                                    tituloLeyenda={'Barra de desempeño'}
                                    objetivos={puntuaciones} 
                                    colores={colores} 
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    hoveredIndex={hoveredIndex} 
                                />
                            </div>
                        </div>
                    )}
                    
                    {tabActiva === 'graficos' && (
                        <div className="tab-content">
                            <DesempenoTotal objetivos={puntuaciones} />
                            
                            <GraficoObjetivos 
                                objetivos={objetivos}
                                puntuaciones={puntuaciones}
                                colores={colores}
                            />
                        </div>
                    )}
                    
                    {tabActiva === 'detalles' && (
                        <div className="tab-content">
                            <div className="contenedor-boton">
                                <h3 style={{marginLeft:"17px"}}>Objetivos asignados:</h3>
                                <BotonPdfTrimestre nombreEmpleado={empleado?.nombre} idEmpleado={id} />
                            </div>
                            
                            {objetivos && objetivos.length !== 0 ?  (
                                <ul className="lista">
                                    {objetivos.map((objetivos,index)=>(
                                        <li key={index}>
                                            <Objetivo objetivo={objetivos} empleado={id} />
                                        </li>
                                ))}
                                </ul>
                            ) : (<SinElementos elemento={'objetivos asignados.'}/>)}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Vista para empleados no admin */}
                    {objetivos && objetivos.length !== 0 ?  (
                        <>
                            <h3 style={{marginLeft:"17px", marginTop:"20px"}}>Tus objetivos asignados:</h3>
                            <ul className="lista">
                                {objetivos.map((objetivos,index)=>(
                                    <li key={index}>
                                        <Objetivo objetivo={objetivos} empleado={id} />
                                    </li>
                            ))}
                            </ul>
                        </>
                    ) : (<SinElementos elemento={'objetivos asignados.'}/>)}
                </>
            )}
            
        </div>

    );
}

export default Feed;
