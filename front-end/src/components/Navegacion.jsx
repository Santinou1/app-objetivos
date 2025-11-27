import React from 'react';
import '../styles/Header.css'; // 
import { Link } from 'react-router-dom';
import { useUserContext, useUserToggleContext } from "../UserProvider.jsx";
import logo from '../images/agLogo.png';

const Navegacion = () => {
  const {user} = useUserContext();
  const {logout} = useUserToggleContext();

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          {
            user ? (
              <li onClick={logout} className='cerrar-sesion'><a> Cerrar sesión</a></li>
            ) : (
              <li><Link to="/">Login</Link></li>   
            )
          }
          
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
        </ul>
      </nav>
      <div className="header-logo-container">
        <img src={logo} alt="Logo" className="header-logo-nav" />
      </div>
    </header>
  );
}

export default Navegacion;