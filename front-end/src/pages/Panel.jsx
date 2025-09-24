import ObjetivoPanel from "../components/ObjetivoPanel";
import Certificacion from "../components/Certificacion"
import { useState, useEffect } from "react";
import axios from 'axios';
import SinElementos from "../components/SinElementos";
import { getApiUrl } from "../config/configURL";
import Paginacion from "../components/Paginacion";
import Filtros from "../components/Filtros";
import '../styles/Panel.css'

function Panel(){
    const [objetivos, setObjetivos] = useState(null);
    const [lista, setLista] = useState(null);
    const [error, setError]  =useState(null);
    const [cantidadObjetivos, SetCantidadObjetivos] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [nObjetivos, setNObjetivos] = useState([]);
    const [nPages, setNPages] = useState(0);
    const [tipoDeLista, setTipoDelista] = useState('objetivos');
    const url = getApiUrl();
    
    const handleListaFiltrada = (listaNueva)=>{
        setLista(listaNueva);
        setCurrentPage(1);
        console.log(lista)
    }
    useEffect(()=>{
        setIsLoading(true);
        axios.get(`${url}/api/${tipoDeLista}`)
            .then( response => {
                console.log(`${url}/api/${tipoDeLista}`)
                console.log(response)
                setObjetivos(response.data);

                setLista(response.data);
                
            })
            .catch( error => {
                setError(error.message);
                setIsLoading(false);
            });
        
            console.log(objetivos)
    },[tipoDeLista]);

    useEffect(() => {
        if (lista) {
            const indexFin = currentPage * cantidadObjetivos;
            const indexIni = indexFin - cantidadObjetivos;
            setNObjetivos(lista.slice(indexIni, indexFin)); // Calcula la lista paginada
            setNPages(Math.ceil(lista.length / cantidadObjetivos)); // Calcula el número de páginas
            setIsLoading(false);
        }
    }, [lista, currentPage, cantidadObjetivos]); 

    const cambiarTipoDeLista = ()=>{
        setIsLoading(true)
        if(tipoDeLista === 'objetivos'){
            setTipoDelista('certificaciones')
        }else{
            setTipoDelista('objetivos')
        }
    }

    return (
        <div>
            {error && <p>Error : {error}</p>}
            {isLoading ? (
                <p>Cargando ...</p>
            ): (
                <>
                    <div className='container-tipo-lista' onClick={cambiarTipoDeLista}>
                        <div className={`toggle-lista ${tipoDeLista === "objetivos" ? "seleccionado" : "no-seleccionado"}`}>Objetivos</div>
                        <div className={`toggle-lista ${tipoDeLista === "certificaciones" ? "seleccionado" : "no-seleccionado"}`}>Certificaciones</div>
                    </div>
                    
                    <h1 className="titulo">Lista de {tipoDeLista}</h1>
                    <hr className="linea"></hr>
                    <Filtros manejarLista={handleListaFiltrada} lista={objetivos} />
                    
                    {(nObjetivos || []).length !== 0  ?  (
                        <>
                            <ul className="lista">
                                {nObjetivos.map((objetivos,index)=>(
                                    <li key={index}>
                                        {tipoDeLista === "objetivos" ? (
                                            <ObjetivoPanel objetivo={objetivos} />
                                        ) : (
                                            <Certificacion certificacion={objetivos} />
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <Paginacion 
                                currentPage={currentPage} 
                                setCurrentPage={setCurrentPage}
                                nPages={nPages}    
                            />
                        </> ) : (
                    <SinElementos elemento={tipoDeLista}/>
                    )}
                   
                </>
            )

            }
           
            
        </div>

    );
}

export default Panel;