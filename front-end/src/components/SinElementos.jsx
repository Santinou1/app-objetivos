import '../styles/SinElementos.css';

function SinElementos({elemento, estilo}){
    
    return(
        <div className={`contenedor-sinElementos ${estilo}`}>
            { estilo === 'puntuacion' ? <p><b>No se encontraron{elemento}</b></p>:
                <h2>No se encontraron {elemento}</h2>
            }
        </div>
    );

}

export default SinElementos;