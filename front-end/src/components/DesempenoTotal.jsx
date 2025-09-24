import { useEffect, useState } from "react";


function DesempenoTotal({objetivos}){
    const [total, setTotal] = useState(0);


  useEffect(() => {
    // Calcular el total cuando 'formateado' cambie
    const nuevoTotal = objetivos.reduce((acumulador, item) => {
      return acumulador + item.despeno;
    }, 0);
    
    setTotal(nuevoTotal);
  }, [objetivos]); 
    return(
        <>
            <h3 style={{marginLeft:"17px"}}>Desempeño total: {total.toFixed(2)}%</h3>
           
        </>
    );
}
export default DesempenoTotal;