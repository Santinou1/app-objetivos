import React from 'react';
import { useNavigate } from 'react-router-dom';

function BotonLink({ ruta, children, style }){
    const navigate = useNavigate();

    const manejarClick = () => {
      navigate(ruta);
    };
    return(
    
        <button className='boton-link' onClick={manejarClick} style={style}>
            {children}
        </button>
    
    );
}
export default BotonLink;