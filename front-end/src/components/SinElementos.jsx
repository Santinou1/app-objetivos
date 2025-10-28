import '../styles/SinElementos.css';

function SinElementos({elemento, estilo}){
    
    const getIcon = (elemento) => {
        if (elemento === 'objetivos') return '🎯';
        if (elemento === 'certificaciones') return '📜';
        return '📋';
    };

    const getMessage = (elemento) => {
        if (elemento === 'objetivos') return 'Aún no hay objetivos creados. ¡Comienza creando tu primer objetivo!';
        if (elemento === 'certificaciones') return 'No hay certificaciones disponibles. ¡Agrega una nueva certificación!';
        return `No se encontraron ${elemento}`;
    };
    
    return(
        <div className={`contenedor-sinElementos ${estilo}`}>
            { estilo === 'puntuacion' ? 
                <p className="puntuacion"><b>No se encontraron {elemento}</b></p>
                :
                <>
                    <div className="icon">{getIcon(elemento)}</div>
                    <h3>¡Ups! Parece que está vacío aquí</h3>
                    <p>{getMessage(elemento)}</p>
                </>
            }
        </div>
    );

}

export default SinElementos;