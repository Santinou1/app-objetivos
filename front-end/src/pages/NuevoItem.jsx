import NuevoObjetivo from './NuevoObjetivo';
import NuevaCertificacion from './NuevaCertificacion';
import {useState} from 'react';
function NuevoItem(){
    const [tipoDeItem, setTipoDeItem] = useState('objetivo');
    const cambiarTipoDeItem = ()=>{
        if(tipoDeItem === 'objetivo'){
            setTipoDeItem('certificacion')
        }else{
            setTipoDeItem('objetivo');
        }
    }
    return(
        <div>
            <div className='container-tipo-lista' onClick={cambiarTipoDeItem}>
                <div className={`toggle-lista ${tipoDeItem === "objetivo" ? "seleccionado" : "no-seleccionado"}`}>Objetivo</div>
                <div className={`toggle-lista ${tipoDeItem === "certificacion" ? "seleccionado" : "no-seleccionado"}`}>Certificacion</div>
            </div>

            {
                tipoDeItem === 'objetivo' ? (
                    <NuevoObjetivo />
                ) : 
                    (<NuevaCertificacion />)
                
            }
        </div>
    );
}

export default NuevoItem;