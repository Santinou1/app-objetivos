export const formateo = (data) =>{
    const objetivosMap = {};
    data.forEach( item => {
        const key = item.titulo;

        if(!objetivosMap[key]){
            objetivosMap[key] = {
                titulon: item.titulo,
                peso: item.peso,
                progreso: item.valor,
                
            }
        }
    })
    const objetivos = Object.values(objetivosMap);

    return objetivos;
} 