
export const fechaISO = () =>{
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
};

export const obtenerFecha = ()=>{
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2,'0');
    const anio = hoy.getFullYear();

    return `${dia}/${mes}/${anio}`;
};
export const formatearISOtoFecha = (date)=>{
    const fecha= date.split('T')[0]
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}
export const formatearFechaToISO = (date)=>{
    const [dia, mes, anio] = date.split("/");
    return `${anio}-${mes}-${dia}`;
}