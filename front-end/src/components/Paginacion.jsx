import '../styles/Paginacion.css';
function Paginacion({setCurrentPage, currentPage, nPages}){
    const next = ()=>{
        if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prev = ()=>{
        if(currentPage > 1) setCurrentPage(currentPage - 1)
    }
    return(
        <div style={{display:'flex', justifyContent:'space-around'}}>
            <h3 className='boton-paginacion' onClick={prev}>Atras</h3>
            <h3 >
                {currentPage} / {nPages}
            </h3>
            <h3 className='boton-paginacion siguiente' onClick={next}>Siguiente</h3>
        </div>
    );
}
export default Paginacion;