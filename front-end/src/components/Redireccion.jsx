import {Link, useParams} from 'react-router-dom'
import '../styles/Redireccion.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../config/configURL.js';
function Redireccion(){
    const url = getApiUrl();
    const [objetivo, setObjetivo] = useState(null);
    const [error, setError]  =useState(null);
    const {tipo, aux} = useParams();
    
    
    const [titulo, setTitulo] = useState('');


    useEffect(()=>{
        if(tipo === 'objetivo'){
        axios.get(`${url}/api/objetivos/ultimo`)
            .then( response => {
                console.log(response)
                setObjetivo(response.data);
            })
            .catch( error => {
                setError(error.message);
            });

            setTitulo('Objetivo agregado con éxito');
           
        }
        if(tipo === 'usuario'){
            setTitulo('Usuario agregado con éxito');

        }
        if(tipo === 'asignado'){
            setTitulo('Objetivo asignado con éxito');
        }
        if(tipo === 'puntuacion'){
            setTitulo('Puntuación actualizada con éxito');
        }
        if(tipo === 'certificacion'){
            setTitulo('Certificación agregada con éxito');
        }
        if(tipo === 'asignado-certificacion'){
            setTitulo('Certificación asignada con éxito')
        }
    },[]);

    return (
        <div className='contenedor-redireccion'>
            {error && <p>Error : {error}</p>}
            <div className='cartel'>
            <div className='contenedor-check'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 60 60">
                <defs><style>
                </style>
                </defs>
                <path class="cls-1" d="M800,510a30,30,0,1,1,30-30A30,30,0,0,1,800,510Zm-16.986-23.235a3.484,3.484,0,0,1,0-4.9l1.766-1.756a3.185,3.185,0,0,1,4.574.051l3.12,3.237a1.592,1.592,0,0,0,2.311,0l15.9-16.39a3.187,3.187,0,0,1,4.6-.027L817,468.714a3.482,3.482,0,0,1,0,4.846l-21.109,21.451a3.185,3.185,0,0,1-4.552.03Z" id="check" transform="translate(-770 -450)"/></svg>
                <h1 className='green-text'>{titulo}</h1>
            </div>
            <h2 className='green-text'>¿Que te gustaria hacer ahora?</h2>
            <ul className='lista-redireccion'>
                
                {
                    objetivo ? (<>
                        <li className='punto'>
                            <Link to={`/asignar-objetivo/${objetivo.idObjetivo}`} className='link-verde'>Asignar el reciente objetivo a empleados.</Link>
                        </li>
                        <li className='punto'>
                            <Link to="/nuevo-objetivo" className='link-verde'>Crear otro objetivo nuevo.</Link>
                        </li>
                    </>) :(
                        <></>
                    )
                }
                {
                    tipo === 'usuario' ? (<>
                        <li className='punto'>
                            <Link to='/nuevoUsuario' className='link-verde'>Crear un nuevo usuario.</Link>
                        </li>
                    </>) :(<></>)
                }
                {
                    tipo === 'asignado' ? (
                        <>
                          <li className='punto'>
                            <Link to={`/asignar-objetivo/${aux}`} className='link-verde'>Asignar un nuevo empleado a este objetivo.</Link>
                          </li>  
                        </>
                    ):(
                        <></>
                    )
                }
                {
                    tipo === 'asignado-certificacion' ?(
                        <>
                            <li className='punto'>
                                <Link to={`/asignar-certificacion/${aux}`} className='link-verde'>Asignar un nuevo empleado a esta certificacion.</Link>
                            </li>  
                        </>
                    ):(
                        <></>
                    )
                }
                {
                    tipo === 'puntuacion' ? (
                        <>

                            <li className='punto'>
                                <Link to={`/feed/objetivos/${aux}`} className='link-verde'>Volver a la lista de objetivos del empleado</Link>
                            </li> 
                        </>
                    ) :(
                        <></>
                    )
                }
                {
                    tipo === 'certificacion' ? (
                        <>
                
                            <li className='punto'>
                                <Link to={`/nuevo-objetivo`} className='link-verde'>Crear nueva certificacion</Link>
                            </li> 
                        </>
                    ):(<></>)
                }
                <li className='punto'>
                    <Link to="/panel" className='link-verde'>Ir al panel.</Link>
                </li>
            </ul>
            </div>
        </div>
    );
}

export default Redireccion;