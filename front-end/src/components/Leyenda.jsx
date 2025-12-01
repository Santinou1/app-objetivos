import '../styles/Leyenda.css';

function Leyenda({colores, objetivos, hoveredIndex, onMouseEnter, onMouseLeave, tituloLeyenda}){
    return(
        <div className="contenedor-leyenda">
            <h3>{tituloLeyenda}</h3>
            {objetivos.map((item, index) => {
                const colorDeObjetivo = colores[index];
                const objetivo = item.titulo;
                const porcentaje = tituloLeyenda === 'Valor Anual del Objetivo' ? (item.peso || 0) : (item.despeno || 0);
                const porcentajeFormateado = tituloLeyenda === 'Porcentaje del Progreso del Valor Anual' 
                    ? `${Number(porcentaje).toFixed(2)}%` 
                    : `${porcentaje}%`;
                
                return(
                    <p  
                        key={index}
                        onMouseEnter={() => onMouseEnter(index)}
                        onMouseLeave={onMouseLeave}
                        style={{
                            boxShadow: hoveredIndex === index 
                                ? `0px 2px 8px ${colorDeObjetivo}40, 0px 4px 16px ${colorDeObjetivo}20` 
                                : undefined
                        }}
                    >
                        <span style={{color: colorDeObjetivo}}>⦿</span> 
                        <span className="objetivo-texto">{objetivo}:</span>
                        <b>{porcentajeFormateado}</b> 
                    </p>
                );
            })}
        </div>
    );
}

export default Leyenda;