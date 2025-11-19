import { useState, useEffect, useCallback } from 'react';
import '../styles/BuscadorObjetivos.css';

function BuscadorObjetivos({ onBuscar, isLoading }) {
    const [termino, setTermino] = useState('');

    // Memoizar la función onBuscar para evitar loops infinitos
    const memoizedOnBuscar = useCallback(onBuscar, []);

    // Búsqueda en tiempo real con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            memoizedOnBuscar(termino.trim());
        }, 300); // Espera 300ms después de que el usuario deje de escribir

        return () => clearTimeout(timer);
    }, [termino, memoizedOnBuscar]);

    const handleInputChange = (e) => {
        setTermino(e.target.value);
    };

    return (
        <div className="buscador-container">
            <div className="buscador-input-container">
                <input
                    type="text"
                    placeholder="Buscar objetivos..."
                    value={termino}
                    onChange={handleInputChange}
                    className="buscador-input"
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}

export default BuscadorObjetivos;
