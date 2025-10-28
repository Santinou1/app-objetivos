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
            {
                tipoDeItem === 'objetivo' ? (
                    <NuevoObjetivo tipoDeItem={tipoDeItem} cambiarTipoDeItem={cambiarTipoDeItem} />
                ) : 
                    (<NuevaCertificacion tipoDeItem={tipoDeItem} cambiarTipoDeItem={cambiarTipoDeItem} />)
                
            }
        </div>
    );
}

export default NuevoItem;