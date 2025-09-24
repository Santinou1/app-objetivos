import { useState, useEffect} from "react";

function BarraDesempeno({ formateado, colores,hoveredIndex, onMouseEnter, onMouseLeave }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    // Calcular el total cuando 'formateado' cambie
    const nuevoTotal = formateado.reduce((acumulador, item) => {
      return acumulador + item.despeno;
    }, 0);
    
    setTotal(nuevoTotal);
  }, [formateado]); 
  return (
      <div style={{ display: 'flex', height: '30px', width: '98%', border: '1px solid #000', borderRadius: '0 10px 10px 0', fontSize:'12px' }}>
        {formateado.map((item, index) => {
          const porcentajePeso = item.peso;
         
          const porcentajeTotal = item.despeno; // Calcular el porcentaje total considerando el peso
          const color = colores[index]; // Usar el color correspondiente
          
          
          return (
            <div
              key={index}
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={onMouseLeave} 
              style={{
                width: `${porcentajeTotal}%`,
                backgroundColor: color,
                textAlign: 'center',
                display: 'flex',
                border: `5px solid ${color}`,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: index === formateado.length - 1 ?'0 10px 10px 0': '0px',
                boxShadow: hoveredIndex === index ? `0px 1px 5px ${color}, 0px 1px 10px ${color}` : undefined,
                //marginLeft: index === 0 ? '0' : '-5px',
                position: 'relative',
                zIndex: formateado.length - index,
              }}
            >
              {porcentajeTotal > 5 ? `${porcentajeTotal.toFixed(2)}%` : ''}
            </div>
          );
        })}
      </div>
    );
  }
  
  export default BarraDesempeno;