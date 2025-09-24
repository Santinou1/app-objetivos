import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {useForm} from 'react-hook-form';
import '../styles/FormUsuario.css';
import { getApiUrl } from "../config/configURL";
import MensajeConfirmacion from "../components/MensajeConfirmacion";
function NuevoUsuario(){
    const {register, handleSubmit} = useForm();
    const [redirect, setRedirect] = useState(false);
    const [errorForm, setErrorForm] = useState('');
    const [error, setError] = useState('');
    const [areas, setAreas] = useState(null);
    const url = getApiUrl();

    const onSubmit = async (data) =>{
    
        const verificar = verificarFormulario(data);
    
        console.log(verificar)
        if(verificar){
        
         
            console.log(data)
            try {
                const response = await fetch(`${url}/api/empleados`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
    
                if(!response.ok){
                    throw new Error('Error en la soclicitud');
                }

                if(response.ok){
                    setRedirect(true);
                }
    
            } catch (error) {
               setErrorForm(error);
            }
        }   
    }

    useEffect(()=>{
        axios.get(`${url}/api/empleados/areas`)
        .then(response => {
            console.log(response)
            setAreas(response.data);
        })
        .catch(error => {
            setError(error.message);
        }); 
    },[]);
    function verificarFormulario(data){
        console.log(data)
        for(const propiedad in data){
            if(data.hasOwnProperty(propiedad)){
                const valor = data[propiedad];
                if(valor === '' || valor === ""){
                    console.log('Esto dio falso')
                    setErrorForm('Faltan campos.');
                    console.log(errorForm);
                    return false;
                }
            }
        }
        data.rol = data.rol=== 'admin'
        console.log(data.usuarioPassword);
        console.log(data.confirmar);
        if(data.usuarioPassword === data.confirmar){
            return true;
        }else{
            setErrorForm('Las contraseñas no coinciden.');
            return false;
        }
        
        
    }

    if (redirect) {
        return <Navigate to='/redireccion/usuario' />;
    }
    return (
      <div className="form-container">
            
            <form className="form-agregar" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="titulo">Agregar nuevo usuario</h1>
                {errorForm && <MensajeConfirmacion titulo={errorForm} tipo={'error'}/>}
                
                <div className="contenedor-input">
                    <label className="label-form">Nombre</label>
                    <input type="text" className="input-text" {...register('nombre')}></input>
                </div>

                <div className="contenedor-input">
                    <label>Apellido</label>
                    <input type="text" className="input-text" {...register('apellido')}></input>
                </div>

                <div className="contenedor-input">
                    <label>Puesto</label>
                    <input type="text" className="input-text" {...register('puesto')}></input>
                </div>

                <div className="contenedor-input">
                    <label>Area</label>
                    <select className="input-select" {...register('area')}>
                        {areas?.map((area)=> (
                            <option key={area.nombre} value={area.nombre}>
                                {area.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="contenedor-input">
                    <label>Correo electronico<b>**</b></label>
                    <input type="email" className="input-text" {...register('email',{autoComplete:"off"})}></input>
                </div>

                <div className="contenedor-input">
                    <label>Contraseña</label>
                    <input type="password" className="input-text" {...register('usuarioPassword',{autoComplete:"off"})}></input>
                </div>

                <div className="contenedor-input">
                    <label>Confirmar contraseña</label>
                    <input type="password" className="input-text" {...register('confirmar')}></input>
                </div>

                <div className="contenedor-input">
                    <label><b>¿Es administrador?</b></label>
                    <div className="contenedor-radio">
                        <label className="label-radio">
                            <input
                                className="input-radio"
                                type="radio"
                                value="admin"
                                {...register('rol')}
                            />
                            Sí
                        </label>

                        <label className="label-radio">
                            <input
                                className="input-radio"
                                type="radio"
                                value="user"
                                {...register('rol')}
                            />
                            No
                        </label>
                    </div>
                </div>
                <div className="contenedor-input">
                    <p className="aviso">{'(**) Los campos marcados tienen que ser unicos para cada empleado.'}</p>
                    <button type="submit" value="Agregar" className="boton-submit">Agregar usuario</button>
                </div>
                
            </form>
      </div>
    );
}
export default NuevoUsuario;