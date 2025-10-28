import SinElementos from "../components/SinElementos";
import Paginacion from "../components/Paginacion";
import axios from 'axios';
import { useState, useEffect } from 'react';
import '../styles/Empleados.css';
import { Link } from 'react-router-dom';
import { getApiUrl } from "../config/configURL";

function Empleados(){
    const url = getApiUrl();
    const [empleados, setEmpleados] = useState(null);
    const [empleadosFiltrados, setEmpleadosFiltrados] = useState(null);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [empleadosPorPagina] = useState(9); // 3 filas x 3 columnas = 9 empleados por página
    
    // Estado para filtros
    const [filtroActivo, setFiltroActivo] = useState('habilitados'); // 'todos', 'habilitados', 'deshabilitados'

    useEffect(()=>{
        axios.get(`${url}/api/empleados`)
            .then( response => {
                console.log(response)
                setEmpleados(response.data);
                setCargando(false);
            })
            .catch( error => {
                setError(error.message);
                setCargando(false);
            });
    },[]);

    // Efecto para filtrar empleados cuando cambia el filtro o los empleados
    useEffect(() => {
        if (empleados) {
            let filtrados = empleados;
            
            if (filtroActivo === 'habilitados') {
                filtrados = empleados.filter(emp => emp.activo === 1);
            } else if (filtroActivo === 'deshabilitados') {
                filtrados = empleados.filter(emp => emp.activo === 0);
            }
            
            setEmpleadosFiltrados(filtrados);
            setCurrentPage(1); // Resetear a la primera página cuando cambia el filtro
        }
    }, [empleados, filtroActivo]);

    // Función para cambiar filtro
    const cambiarFiltro = (nuevoFiltro) => {
        setFiltroActivo(nuevoFiltro);
    };

    // Calcular empleados para la página actual
    const indexUltimoEmpleado = currentPage * empleadosPorPagina;
    const indexPrimerEmpleado = indexUltimoEmpleado - empleadosPorPagina;
    const empleadosActuales = empleadosFiltrados ? empleadosFiltrados.slice(indexPrimerEmpleado, indexUltimoEmpleado) : [];
    const totalPaginas = empleadosFiltrados ? Math.ceil(empleadosFiltrados.length / empleadosPorPagina) : 0;

    // Función para obtener las iniciales del nombre
    const getIniciales = (nombre) => {
        return nombre
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    if(cargando) {
        return (
            <div className="empleados-container">
                <div className="empleados-loading">
                    <div className="empleados-loading-spinner"></div>
                    <p>Cargando empleados...</p>
                </div>
            </div>
        );
    }

    if(error) {
        return (
            <div className="empleados-container">
                <div className="empleados-error">
                    <h3>⚠️ Error</h3>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="empleados-container">
            <h1 className="titulo">Lista de Empleados</h1>
            <hr className="linea"></hr>
            
            {/* Toggle de filtros */}
            <div className="empleados-filtros">
                <div className="filtros-toggle">
                    <button 
                        className={`filtro-opcion ${filtroActivo === 'habilitados' ? 'active' : ''}`}
                        onClick={() => cambiarFiltro('habilitados')}
                    >
                        Habilitados
                    </button>
                    <button 
                        className={`filtro-opcion ${filtroActivo === 'deshabilitados' ? 'active' : ''}`}
                        onClick={() => cambiarFiltro('deshabilitados')}
                    >
                        Deshabilitados
                    </button>
                    <button 
                        className={`filtro-opcion ${filtroActivo === 'todos' ? 'active' : ''}`}
                        onClick={() => cambiarFiltro('todos')}
                    >
                        Todos
                    </button>
                </div>
            </div>
            
            {empleadosActuales && empleadosActuales.length > 0 ? (
                <>
                    <div className="empleados-grid">
                        {empleadosActuales.map((empleado, index) => (
                        <div 
                            key={empleado.idEmpleado} 
                            className={`empleado-card ${empleado.activo === 0 ? 'disabled' : ''}`}
                        >
                            {/* Header con avatar e info básica */}
                            <div className="empleado-header">
                                <div className={`empleado-avatar ${empleado.activo === 0 ? 'disabled' : ''}`}>
                                    {getIniciales(empleado.nombre)}
                                </div>
                                <div className="empleado-info">
                                    <h3 className="empleado-nombre">{empleado.nombre}</h3>
                                    <p className="empleado-area">{empleado.area}</p>
                                    <span className={`empleado-estado ${empleado.activo ? 'habilitado' : 'deshabilitado'}`}>
                                        {empleado.activo ? 'Habilitado' : 'Deshabilitado'}
                                    </span>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="empleado-acciones">
                                <Link 
                                    to={empleado.activo === 0 ? '#' : `/feed/objetivos/${empleado.idEmpleado}`}
                                    className={`empleado-boton ${empleado.activo === 0 ? 'disabled' : ''}`}
                                >
                                    <span>🎯</span>
                                    Ver Objetivos
                                </Link>
                                
                                <Link 
                                    to={empleado.activo === 0 ? '#' : `/feed/certificaciones/${empleado.idEmpleado}`}
                                    className={`empleado-boton ${empleado.activo === 0 ? 'disabled' : ''}`}
                                >
                                    <span>📜</span>
                                    Ver Certificaciones
                                </Link>
                                
                                <Link 
                                    to={`/actualizar-usuario/${empleado.idEmpleado}`}
                                    className="empleado-boton primary"
                                >
                                    <span>⚙️</span>
                                    Administrar Cuenta
                                </Link>
                            </div>
                        </div>
                    ))}
                    </div>
                    
                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <Paginacion 
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            nPages={totalPaginas}
                        />
                    )}
                </>
            ) : (
                <SinElementos elemento='empleados'/>
            )}
        </div>
    );
}

export default Empleados;
