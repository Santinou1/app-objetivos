import '../styles/TabsNavegacion.css';

function TabsNavegacion({ tabActiva, onCambiarTab }) {
    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: '📋' },
        { id: 'graficos', label: 'Gráficos', icon: '📊' },
        { id: 'detalles', label: 'Detalles', icon: '📄' }
    ];

    return (
        <div className="tabs-navegacion">
            <div className="tabs-container">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${tabActiva === tab.id ? 'active' : ''}`}
                        onClick={() => onCambiarTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="tab-indicator" />
        </div>
    );
}

export default TabsNavegacion;
