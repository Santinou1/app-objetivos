import ObjetivoPanel from "../components/ObjetivoPanel";
import Certificacion from "../components/Certificacion"
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import SinElementos from "../components/SinElementos";
import { getApiUrl } from "../config/configURL";
import Paginacion from "../components/Paginacion";
import Filtros from "../components/Filtros";
import BuscadorObjetivos from "../components/BuscadorObjetivos";
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
    const [isBuscando, setIsBuscando] = useState(false);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const url = getApiUrl();
    
    const handleListaFiltrada = (listaNueva)=>{
        setLista(listaNueva);
        setCurrentPage(1);
        console.log(lista)
    }

    const handleBuscar = useCallback(async (termino) => {
        if (tipoDeLista !== 'objetivos') {
            return; // Solo buscar en objetivos
        }

        setTerminoBusqueda(termino);
        setCurrentPage(1);

        if (!termino || termino.trim() === '') {
            // Si no hay término, mostrar todos los objetivos
            setLista(objetivos);
            setIsBuscando(false);
            return;
        }

        setIsBuscando(true);
        try {
            const response = await axios.get(`${url}/api/objetivos/buscar/${encodeURIComponent(termino)}`);
            console.log('Resultados de búsqueda:', response.data);
            setLista(response.data);
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setError('Error al buscar objetivos: ' + error.message);
            setLista([]);
        } finally {
            setIsBuscando(false);
        }
    }, [tipoDeLista, objetivos, url])
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
        setTerminoBusqueda(''); // Limpiar búsqueda
        setIsBuscando(false);
        if(tipoDeLista === 'objetivos'){
            setTipoDelista('certificaciones')
        }else{
            setTipoDelista('objetivos')
        }
    }

    return (
        <div className="panel-container">
            {error && (
                <div className="error-container">
                    <h3>⚠️ Error</h3>
                    <p>{error}</p>
                </div>
            )}
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Cargando...</p>
                </div>
            ): (
                <>
                    <div className='container-tipo-lista' onClick={cambiarTipoDeLista}>
                        <div className={`toggle-lista ${tipoDeLista === "objetivos" ? "seleccionado" : "no-seleccionado"}`}>Objetivos</div>
                        <div className={`toggle-lista ${tipoDeLista === "certificaciones" ? "seleccionado" : "no-seleccionado"}`}>Certificaciones</div>
                    </div>
                    
                    <h1 className="titulo">Lista de {tipoDeLista}</h1>
                    <hr className="linea"></hr>
                    
                    {tipoDeLista === 'objetivos' && (
                        <BuscadorObjetivos 
                            onBuscar={handleBuscar} 
                            isLoading={isBuscando}
                        />
                    )}
                    
                    <Filtros manejarLista={handleListaFiltrada} lista={objetivos} />
                    
                    {terminoBusqueda && tipoDeLista === 'objetivos' && (
                        <div style={{margin: '10px 17px', color: '#666', fontSize: '14px'}}>
                            {isBuscando 
                                ? 'Buscando...' 
                                : `Resultados para "${terminoBusqueda}": ${lista?.length || 0} objetivo(s) encontrado(s)`
                            }
                        </div>
                    )}
                    
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
            )}
        </div>
    );
}

export default Panel;