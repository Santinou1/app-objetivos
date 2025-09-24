import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate} from 'react-router-dom';
import '../styles/ActualizarDatos.css';
import axios from 'axios';
import MensajeConfirmacion from '../components/MensajeConfirmacion.jsx';
import Confirmacion from '../components/Confirmacion';
import { getApiUrl } from '../config/configURL';

function ActualizarDatos() {
  const url = getApiUrl();
  // Estado inicial del objeto
  const navigate = useNavigate();
  const { id } = useParams()
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [contrasenaAct, setContrasenaAct] = useState(false);
  const [usuarioData, setUsuarioData] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [contador, setContador] = useState(3);
  const [redirigir, setRedirigir] = useState(false);

  useEffect(()=>{
    if (contador > 0 && mostrarMensaje && !error) {
        // Si el contador es mayor que 0, configura un intervalo para restar 1 cada segundo
        const timer = setTimeout(() => {
          setContador(contador - 1);
        }, 1000);
  
        return () => clearTimeout(timer); // Limpia el timeout al desmontar el componente
      } else if(contador === 0) {
        // Cuando el contador llega a 0, activa la redirección
        navigate('/empleados');
      }
  
  },[mostrarMensaje,contador])



  const handleEstado = async () =>{
    try{
      const data = {activo: usuarioData.activo};
      const response = await axios.put(`${url}/api/usuarios/${usuarioData.idUsuario}`,data);
      if(response.status === 200){
        navigate('/empleados');
      }
    }catch(error){
      if(error.response){
        setError(error.response.data.message || 'Ocurrió un error en el servidor');
    }else if(error.request){
        setError('No se recibio respuesta del servidor');
    }else{
        setError('Error en la configuracion de la solicitud: '+ error.message);
    }
    }
  }
  // Función para manejar los cambios en los inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Manejar los cambios en los campos de usuario
    if (name === 'email' || name === 'rol') {
      setUsuarioData({
        ...usuarioData,
        [name]: value, // Actualiza solo la propiedad modificada en usuarioData
      });
    }

    // Manejar los cambios en los campos de contraseñas
    if (name === 'currentPassword' || name === 'newPassword' || name === 'confirmPassword') {
      setPasswords({
        ...passwords,
        [name]: value, // Actualiza solo la propiedad modificada en passwords
      });
    }

    if (name === 'area' || name === 'puesto' || name === 'nombre') {
      setEmpleado({
        ...empleado,
        [name]: value, // Actualiza solo la propiedad modificada en empleado
      });
    };
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Aquí podrías hacer una llamada a la API para actualizar los datos
    console.log('Datos actualizados:', usuarioData);
    console.log('Contraseñas ingresadas', passwords);
    if (passwords.currentPassword && passwords.newPassword && passwords.confirmPassword) {
        try{
            const verificar = {
                idUsuario: usuarioData.idUsuario,
                usuarioPassword: passwords.currentPassword,
            }
            const response = await axios.post(`${url}/api/usuarios/confirm`,verificar);
            if(response.status === 200){
                if(passwords.newPassword===passwords.confirmPassword){
                    const actualizarContraseña = {
                        usuarioPassword: passwords.newPassword,
                        idUsuario: usuarioData.idUsuario,
                    }
                    const res = await axios.put(`${url}/api/usuarios/confirm`,actualizarContraseña);
                    if(res.status === 200){
                        setPasswords({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setContrasenaAct(true);
                    }
                }else{
                    
                    setError("La contraseña nueva no coincide con la confirmación.")
                }
            }
        }catch(error){
            
            if(error.response){
                setError(error.response.data.message || 'Ocurrió un error en el servidor');
            }else if(error.request){
                setError('No se recibio respuesta del servidor');
            }else{
                setError('Error en la configuracion de la solicitud: '+ error.message);
            }
        }
    }else {
      
      setError("Ingrese datos en los 3 campos de contraseñas, para cambiar la clave.");
      if(!passwords.confirmPassword && !passwords.newPassword && !passwords.currentPassword){
        setError('');
      }
      
    }
    try {
        const data = {
            nombre: empleado.nombre,
            puesto: empleado.puesto,
            area: empleado.area,
            idEmpleado: id,
        }
        const dataUsuario = {
          email: usuarioData.email,
          rol: usuarioData.rol,
          empleado : id,
          nombre: empleado.nombre,
        }
        alert(dataUsuario)
        const response = await axios.put(`${url}/api/empleados/`, data);
        const response2 = await axios.put(`${url}/api/usuarios/`,dataUsuario);
        if(response.status === 200 && response2.status === 200){
            console.log(response)
            console.log(response2)
            setMostrarMensaje(true);
            console.log(mostrarMensaje)
        }
    }catch (error) {
        setMostrarMensaje(false);
        if(error.response){
            setError(error.response.data.message || 'Ocurrió un error en el servidor');
        }else if(error.request){
            setError('No se recibio respuesta del servidor');
        }else{
            setError('Error en la configuracion de la solicitud: '+ error.message);
        }
    } 
}

  useEffect(() => {
    axios.get(`${url}/api/empleados/${id}`)
      .then(response => {
        console.log(response)
        setEmpleado(response.data);

      })
      .catch(error => {
        setError(error.message);
      });
    axios.get(`${url}/api/usuarios/${id}`)
      .then(response => {
        console.log(response)
        setUsuarioData(response.data);

      })
      .catch(error => {
        setError(error.message);
      });
  }, [id]);


  return (
    <div className='form-contenedor'>
      {usuarioData && empleado ? (
        <form className='form-actualizar-datos' onSubmit={handleSubmit}>
          <h2>Actualizar Datos</h2>
          {console.log(mostrarMensaje)}

          {mostrarMensaje && <MensajeConfirmacion titulo={`Datos actualizados con exito. Regresando en ${contador} seg.`} tipo={'exito'}/> }
          {contrasenaAct && <MensajeConfirmacion titulo = {`Contraseña actualizada con exito. Regresando en ${contador} seg.`} tipo={'exito'}/>}
          {error && <MensajeConfirmacion titulo={error} tipo={'error'}/>}
          <div className='contenedor-input'>
            <label>Nombre:</label>
            <input

              className='input-datos-actualizar'
              type="text"
              name="nombre"
              value={empleado.nombre}
              onChange={handleInputChange}
            />
          </div>
          <div className='contenedor-input'>
            <label>Email:</label>
            <input
              className='input-datos-actualizar'
              type="email"
              name="email"
              value={usuarioData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className='contenedor-input'>
            <label><b>Cambiar rol:</b></label>
            <div className="contenedor-radio">
              <label className="label-radio">
                <input
                  className="input-radio"
                  type="radio"
                  value="admin"
                  name='rol'
                  checked={usuarioData.rol === 'admin'}
                  onChange={handleInputChange}
                />
                Admin
              </label>

              <label className="label-radio">
                <input
                  className="input-radio"
                  type="radio"
                  value="user"
                  name='rol'
                  checked={usuarioData.rol === 'user'}
                  onChange={handleInputChange}
                />
                Usuario
              </label>
            </div>
          </div>
          <div className='contenedor-input'>
            <h2>Actualizar contraseña</h2>
            
            <label>Ingrese la contraña actual:</label>
            <input
              className='input-datos-actualizar'
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className='contenedor-input'>
            <label>Ingrese la nueva contraseña:</label>
            <input
              className='input-datos-actualizar'
              type='password'
              name='newPassword'
              value={passwords.newPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className='contenedor-input'>
            <label>Confirme la contraseña:</label>
            <input
              className='input-datos-actualizar'
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <div className='contenedor-input'>
            <h2>Actualizar datos del empleado</h2>

            <div className='contenedor-input'>
              <label htmlFor='opcion'>Area</label>
              <select
                className="select-datos"
                id="opcion"
                name='area'
                value={empleado.area}
                onChange={handleInputChange}>
                <option value={empleado.area}>{empleado.area}</option>
                <option value="Marketing">Marketing</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Contabilidad">Contabilidad</option>
              </select>
            </div>
            <div className='contenedor-input'>
              <label>Puesto</label>
              <input
                className='input-datos-actualizar'
                type='text'
                name="puesto"
                value={empleado.puesto}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className='button-datos' type="submit">Guardar</button>
          <button className='button-datos' type="button" onClick={handleEstado} style={{ backgroundColor: usuarioData.activo === 1 ? 'gray' : 'green', color: 'white', width:'100%'}}>
            {usuarioData.activo === 1 ? 'Deshabilitar cuenta' : 'Habilitar cuenta'}
          </button>
          <Confirmacion idEmpleado={id} tipo={'empleado'}/>
        </form>)
        :
        (
          <p>No se cargaron los datos...</p>
        )}
    </div>
  );
}

export default ActualizarDatos;
