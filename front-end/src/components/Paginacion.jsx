import '../styles/Paginacion.css';

function Paginacion({setCurrentPage, currentPage, nPages}){
    const next = ()=>{
        if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prev = ()=>{
        if(currentPage > 1) setCurrentPage(currentPage - 1)
    }
    
    return(
        <div className="contenedor-paginacion">
            <button 
                className='boton-paginacion anterior' 
                onClick={prev}
                disabled={currentPage === 1}
            >
                Anterior
            </button>
            
            <div className="info-pagina">
                {currentPage} / {nPages}
            </div>
            
            <button 
                className='boton-paginacion siguiente' 
                onClick={next}
                disabled={currentPage === nPages}
            >
                Siguiente
            </button>
        </div>
    );
}

export default Paginacion;
