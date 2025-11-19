import '../styles/BotonPdfTrimestre.css';
import axios from 'axios';
import { getApiUrl } from '../config/configURL';
import { useState } from 'react';

function BotonPdfTrimestre({nombreEmpleado, idEmpleado}){
    const url = getApiUrl();
    const [mostrarOpciones, setMostrarOpciones] = useState(false);
    
    const generarPdf = async (trimestre = null) => {
        try {
            console.log('📄 Iniciando generación de PDF...');
            console.log('Datos:', { idEmpleado, nombreEmpleado, trimestre });
            
            // Llamar al endpoint del backend
            const response = await axios.post(`${url}/api/pdf/generar-pdf`, {
                idEmpleado: idEmpleado,
                nombreEmpleado: nombreEmpleado,
                trimestre: trimestre
            }, {
                responseType: 'blob' // Importante para recibir el PDF como blob
            });

            console.log('✅ Respuesta recibida del servidor');
            console.log('Tipo de contenido:', response.headers['content-type']);
            console.log('Tamaño del blob:', response.data.size);

            // Verificar que sea un PDF válido
            if (response.data.size === 0) {
                throw new Error('El PDF generado está vacío');
            }

            // Crear un blob URL y descargar el archivo
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            
            const nombreArchivo = trimestre 
                ? `Reporte_${nombreEmpleado}_Trimestre_${trimestre}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`
                : `Reporte_${nombreEmpleado}_Completo_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
            console.log('✅ PDF descargado exitosamente');
            setMostrarOpciones(false);
        } catch (error) {
            console.error('❌ Error al generar el PDF:', error);
            console.error('Detalles del error:', error.response?.data);
            
            // Si el error tiene una respuesta del servidor, intentar leerla
            if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                console.error('Error del servidor:', text);
                alert(`Error al generar el PDF: ${text}`);
            } else {
                alert(`Hubo un error al generar el PDF: ${error.message}`);
            }
        }
    }

    const toggleOpciones = () => {
        setMostrarOpciones(!mostrarOpciones);
    }

    return(
        <div className="contenedor-pdf-trimestre">
            <div className="boton-pdf no-print" onClick={toggleOpciones}>
                <svg
                    width="32px"
                    height="32px"
                    viewBox="-4 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                        d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8598 26.4347 17.2452 26.3295 17.6413 26.2217C17.7 26.2054 17.759 26.19 17.8189 26.1737C18.9117 25.9323 20.0779 25.6655 21.3221 25.547C22.1476 25.9179 22.9875 26.1696 23.8109 26.289C24.5781 26.4003 25.2937 26.3841 25.7811 26.2402C26.9043 25.8952 27.4523 25.3178 27.3706 26.1461Z"
                        fill="#EB5757"
                        ></path>
                    </g>
                </svg>
                <p className='label-pdf'>Generar PDF</p>
                <span className="flecha-dropdown">▼</span>
            </div>
            
            {mostrarOpciones && (
                <div className="opciones-pdf">
                    <button onClick={() => generarPdf()}>Reporte Completo</button>
                    <button onClick={() => generarPdf(1)}>Trimestre 1</button>
                    <button onClick={() => generarPdf(2)}>Trimestre 2</button>
                    <button onClick={() => generarPdf(3)}>Trimestre 3</button>
                    <button onClick={() => generarPdf(4)}>Trimestre 4</button>
                </div>
            )}
        </div>
    );
}
export default BotonPdfTrimestre;
