import React,{ useState} from "react";
import { usePageTitle } from "../components/nombrePag";
import '../styles/Login.css'
import { useUserContext, useUserToggleContext } from "../UserProvider";
import { Navigate } from "react-router-dom";
function Login(){
    const {user, error} = useUserContext();
    const {login, logout} = useUserToggleContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    usePageTitle('Login | Medicion de objetivos')

    const handleSubmit = async(e) =>{
        e.preventDefault();
        console.log('Usuario: ', username);
        console.log('Contraseña: ', password);
        
        await  login(username, password);
    }
    if(user){
        var ruta = '';
        if(user.activo === 1){
        if(user.rol==='admin'){
            ruta= '/panel';
        }else{
            ruta = `/feed/${user.empleado}`;
        }}else{
            ruta = `/cuenta-deshabilitada`;
        }
        console.log(ruta);
        console.log('Estado de la cuenta', user.activo)
        return <Navigate to={ruta}/>
    }

    return(
        <div className="login-container">
            <img className="logo" src="https://americagroupit.com/wp-content/uploads/2024/06/cropped-Logo_AG_Color_VF2024-01.png"
                alt="Logo AG"/>
            <form className="form-login" onSubmit={handleSubmit}>
                
                <h2 className="titulo-login">Iniciar sesión</h2>
                    {error && <p className="error-message">{error}</p>}
                    <label  htmlFor="username">Usuario:</label>
                    <input 
                        type="text" 
                        id="username"
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)} 
                        required
                    />
                    <label htmlFor="password">Contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />
                
                <button type="submit">Entrar</button>
            </form>
        </div>
    );

}
export default Login;