import { useEffect, useState } from "react";


function DesempenoTotal({objetivos}){
    const [total, setTotal] = useState(0);


  useEffect(() => {
    if (!objetivos || !Array.isArray(objetivos)) {
      setTotal(0);
      return;
    }
    
    // Cálculo: suma total de todos los promedios de puntuaciones
    const sumaPuntuaciones = objetivos.reduce((acumulador, item) => {
      return acumulador + Number(item.despeno || 0);
    }, 0);
    
    setTotal(sumaPuntuaciones);
  }, [objetivos]); 
    return(
        <>
            <h3 style={{marginLeft:"17px"}}>Desempeño total: {Number(total || 0).toFixed(2)}%</h3>
           
        </>
    );
}
export default DesempenoTotal;