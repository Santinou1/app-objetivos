import '../styles/GraficoObjetivos.css';

function GraficoObjetivos({ objetivos, puntuaciones, colores }) {
    // Combinar datos de peso y desempeño con validación de tipos
    const datosGrafico = objetivos.map((obj, index) => {
        const puntuacion = puntuaciones.find(p => p.titulo === obj.titulo);
        return {
            titulo: obj.titulo || 'Sin título',
            peso: Number(obj.peso) || 0,
            desempeno: Number(puntuacion?.despeno) || 0,
            color: colores[index] || '#fbb003'
        };
    });

    // Calcular el tamaño del círculo
    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const getStrokeDashoffset = (percentage) => {
        return circumference - (percentage / 100) * circumference;
    };

    return (
        <div className="grafico-objetivos-container">
            <div className="grafico-header">
                <h2>Resumen de Objetivos</h2>
                <p className="grafico-subtitle">
                    Peso asignado vs Desempeño alcanzado
                </p>
            </div>

            <div className="grafico-grid">
                {datosGrafico.map((dato, index) => {
                    // Calcular el desempeño real sobre el peso
                    const desempenoReal = (dato.desempeno / 100) * dato.peso;
                    const porcentajeCompletado = dato.peso > 0 ? dato.desempeno : 0;

                    return (
                        <div key={index} className="grafico-card">
                            <div className="grafico-card-inner">
                                {/* Círculo de progreso */}
                                <div className="progress-ring-container">
                                    <svg width={size} height={size} className="progress-ring">
                                        {/* Círculo de fondo (peso total) */}
                                        <circle
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth={strokeWidth}
                                        />
                                        {/* Círculo de progreso (desempeño) */}
                                        <circle
                                            cx={size / 2}
                                            cy={size / 2}
                                            r={radius}
                                            fill="none"
                                            stroke={dato.color}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={getStrokeDashoffset(porcentajeCompletado)}
                                            strokeLinecap="round"
                                            className="progress-ring-circle"
                                            style={{
                                                filter: `drop-shadow(0 2px 4px ${dato.color}40)`
                                            }}
                                        />
                                    </svg>
                                    
                                    {/* Porcentaje en el centro */}
                                    <div className="progress-ring-text">
                                        <span className="progress-percentage">
                                            {porcentajeCompletado.toFixed(0)}%
                                        </span>
                                        <span className="progress-label">completado</span>
                                    </div>
                                </div>

                                {/* Información del objetivo */}
                                <div className="grafico-info">
                                    <h3 className="objetivo-titulo-grafico">{dato.titulo}</h3>
                                    
                                    <div className="grafico-stats">
                                        <div className="stat-item">
                                            <span className="stat-icon" style={{color: dato.color}}>⚖</span>
                                            <div className="stat-content">
                                                <span className="stat-label">Peso asignado</span>
                                                <span className="stat-value">{dato.peso}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-item">
                                            <span className="stat-icon" style={{color: dato.color}}>📊</span>
                                            <div className="stat-content">
                                                <span className="stat-label">Desempeño</span>
                                                <span className="stat-value">{dato.desempeno.toFixed(2)}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="stat-item highlight">
                                            <span className="stat-icon" style={{color: dato.color}}>✓</span>
                                            <div className="stat-content">
                                                <span className="stat-label">Completado del peso</span>
                                                <span className="stat-value" style={{color: dato.color}}>
                                                    {desempenoReal.toFixed(2)}% de {dato.peso}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barra de progreso lineal adicional */}
                                    <div className="linear-progress">
                                        <div className="linear-progress-track">
                                            <div 
                                                className="linear-progress-fill"
                                                style={{
                                                    width: `${porcentajeCompletado}%`,
                                                    background: `linear-gradient(90deg, ${dato.color}, ${dato.color}dd)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GraficoObjetivos;
