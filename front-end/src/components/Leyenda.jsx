import '../styles/Leyenda.css';
function Leyenda({colores, objetivos,hoveredIndex, onMouseEnter, onMouseLeave, tituloLeyenda}){
    return(
        <div className="contenedor-leyenda">
            <h3>Leyenda de {tituloLeyenda}</h3>
            {objetivos.map((item, index) => {
                const colorDeObjetivo = colores[index];
                const objetivo = item.titulo;
                const porcentaje = tituloLeyenda === 'Barra de peso de los objetivos' ? item.peso : item.despeno
                return(
                    <p  
                        key={index}
                        onMouseEnter={() => onMouseEnter(index)} // Usar la función del padre
                        onMouseLeave={onMouseLeave} // Usar la función del padre
                        style={{boxShadow: hoveredIndex === index ? `0px 1px 5px ${colorDeObjetivo}, 0px 1px 10px ${colorDeObjetivo}` : undefined}}
                    >
                        <span style={{color:colorDeObjetivo, fontSize:'15px'}}>⦿</span> 
                        {`${objetivo}:`}<b>{ tituloLeyenda === 'Barra de desempeño' ? ` ${porcentaje.toFixed(2)}%`: ` ${porcentaje}%`}</b> 
                    </p>
                )
         
        
            })}
        </div>
    );
}

export default Leyenda;