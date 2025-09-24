import React from 'react';
import '../styles/Header.css'; // 
import { Link } from 'react-router-dom';
import { useUserContext, useUserToggleContext } from "../UserProvider.jsx";

const Navegacion = () => {
  const {user} = useUserContext();
  const {logout} = useUserToggleContext();

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          {
            (user && user.rol === 'admin') ? (
              <>
              <li><Link to="/nuevo-objetivo">Crear nuevo Objetivo/Certificacion</Link></li>
              <li><Link to="/nuevoUsuario">Crear Usuario</Link></li>
              <li><Link to="/panel">Panel</Link></li>
              <li><Link to="/empleados">Empleados</Link></li>
              </>
            ):(
              <></>
            )
          }
          
          {
            user ? (
              <li onClick={logout} className='cerrar-sesion'><a> Cerrar sesión</a></li>
            ) : (
              <li><Link to="/">Login</Link></li>   
            )
          }
        </ul>
      </nav>
    </header>
  );
}

export default Navegacion;