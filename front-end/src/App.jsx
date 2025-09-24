import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navegacion from './components/Navegacion.jsx';

import Login from './pages/Login';
import NuevoUsuario from './pages/NuevoUsuario.jsx';
import Feed from './pages/Feed.jsx';
import Panel from './pages/Panel.jsx';
import Empleados from './pages/Empleados.jsx';

import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { useUserContext } from './UserProvider.jsx';

import NuevoItem from './pages/NuevoItem.jsx';
import ActualizarDatos from './pages/ActualizarDatos.jsx';
import ObjetivoEmpleado from './pages/ObjetivoEmpleado.jsx';
import Redireccion from './components/Redireccion.jsx';
import AsignarObjetivo from './pages/AsignarObjetivo.jsx';
import ActualizarPuntuacion from './pages/ActualizarPuntuacion.jsx';
import ActualizarObjetivo from './pages/ActualizarObjetivo.jsx';
import CuentaDeshabilitada from './pages/CuentaDeshabilitada.jsx';
import AsignarCertificacion from './pages/AsignarCertificacion.jsx';
import ContenedorFeed from './components/contenedorFeed.jsx';
import ActualizarEstadoCertificacion from './pages/ActualizarEstadoCertificacion.jsx'; 
import CertificacionEmpleado from './pages/CertificacionEmpleado.jsx';
import ActualizarCertificacion from './pages/ActualizarCertificacion.jsx';
function App() {

  const {user} = useUserContext();
 
  return (
    <Router>
      <div className='App'>
        {
          user ? <Navegacion /> : <>
          </>
        }
      
       
        <Routes>
          <Route path="/" element={<Login />}/>
          
          <Route element={<ProtectedRoute isAllowed={user}/>}>
            <Route path='/feed/:tipo/:id' element={<ContenedorFeed />}/>    
            <Route path='/objetivo-empleado/:asignacion/:empleado/:objetivo' element={<ObjetivoEmpleado />}/>  
            <Route path='/cuenta-deshabilitada' element={<CuentaDeshabilitada />} />
          </Route>
          <Route element={<ProtectedRoute isAllowed={!!user && user.rol === 'admin'}/>}>
            <Route path='certificacion-empleado/:asignacion/:empleado/:certificacion' element={<CertificacionEmpleado />} />
            <Route path='/panel' element={<Panel />} />
            <Route path='/actualizar-puntuacion/:asignacion/:empleado/:objetivo/:trimestre' element={<ActualizarPuntuacion />} />  
            <Route path='/actualizar-estado-certificacion/:asignacion/:empleado/:certificacion' element={<ActualizarEstadoCertificacion />} />
            <Route path='/redireccion/:tipo/:aux?'element={<Redireccion />} />
            <Route path='/empleados' element={<Empleados />}/>
            <Route path="/nuevo-objetivo" element={<NuevoItem />}/>
            <Route path="/nuevoUsuario" element={<NuevoUsuario />}/>
            <Route path="/asignar-certificacion/:id" element={<AsignarCertificacion />} />
            <Route path='/actualizar-usuario/:id' element={<ActualizarDatos />}/>
            <Route path='/asignar-objetivo/:id' element={<AsignarObjetivo />} />
            <Route path='actualizar-objetivo/:id' element={<ActualizarObjetivo />} />
            <Route path='actualizar-certificacion/:id' element={<ActualizarCertificacion/>} />
          </Route>
        </Routes>
      </div>
      
    </Router>
    
  );
}

export default App;
