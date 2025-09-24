import React, { useState} from "react";
function BotonDesplegable({ titulo, contenido, estilo}){
    const [isOpen, setIsOpen] = useState(false);
    const toggleCuadro = () => {
        setIsOpen(!isOpen);
    };
    return(
        <div style={{width: '100%', ...estilo}}>
            <button onClick={toggleCuadro}  style={{ width: '100%', display:"flex", alignItems:'center'}}>
            {
                titulo === 'Subir archivos' ? (
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                    <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18 18.7499L18 17.2499L6 17.2499L6 18.7499L18 18.7499ZM8.81793 8.12119L11.9999 4.93921L15.1819 8.12119L14.1212 9.18185L12.7499 7.81053L12.7499 15.6745L11.2499 15.6745L11.2499 7.81053L9.87859 9.18185L8.81793 8.12119ZM11.9999 7.06053L12 7.06058L11.9999 7.06058L11.9999 7.06053Z" fill="#ffffff"/> </g>

                    </svg>
                ):(
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                    <g id="SVGRepo_bgCarrier" stroke-width="0"/>

                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                    <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.9853L15.182 12.8033L14.1213 11.7427L12.75 13.114L12.75 5.25L11.25 5.25L11.25 13.114L9.8787 11.7427L8.81804 12.8033L12 15.9853ZM12 13.864L12 13.864L12.0001 13.864L12 13.864Z" fill="#ffffff"/> <path d="M18 17.25L18 18.75L6 18.75L6 17.25L18 17.25Z" fill="#ffffff"/> </g>

                    </svg>
                )
            }
            
            
                {isOpen ? `Contraer ${titulo}` : `Expandir ${titulo}`}
            </button>
      
            {/* Condicional para mostrar el cuadro solo si isOpen es true */}
            {isOpen && (
                <div style={{
                    width:'100%',
                    border: '1px solid #ccc', 
                    padding: '10px', 
                    marginTop: '10px',
                    transition: 'all 0.3s ease',
                    maxHeight: '200px',
                    overflow: 'hidden'
                }}>
                    {contenido}
                </div>
            )}
        </div>
    );
}

export default BotonDesplegable;