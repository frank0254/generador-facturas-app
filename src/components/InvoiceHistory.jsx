import React from 'react';

const InvoiceHistory = ({ history, onDownloadInvoice, onDeleteInvoice }) => {
    
    // Función para mostrar el dinero bonito
    const formatARS = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // ⭐️ FUNCIÓN CLAVE: Convierte "138.779" de nuevo a número 138779 para poder sumar
    const limpiarNumero = (valor) => {
        if (typeof valor === 'number') return valor;
        if (!valor) return 0;
        return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
    };
    
    if (history.length === 0) {
        return (
            <div className="alert alert-info">
                Aún no has generado ninguna factura.
            </div>
        );
    }
    
    const groupedByMonth = history.reduce((acc, factura) => {
        const date = new Date(factura.datos.fecha);
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'); 
        
        if (!acc[key]) {
            acc[key] = {
                totalFacturas: 0,
                totalARS: 0,
                facturas: [],
            };
        }
        
        acc[key].totalFacturas += 1;
        // Sumamos usando la limpieza de puntos de miles
        acc[key].totalARS += limpiarNumero(factura.calculos.montoAbonarARS);
        acc[key].facturas.push(factura);
        
        return acc;
    }, {});

    const sortedMonths = Object.keys(groupedByMonth).sort().reverse();

    return (
        <div className="invoice-history-container">
            <h3 className="text-center text-primary mb-4">Control de Ingresos por Mes</h3>

            {sortedMonths.map((monthKey) => {
                const monthData = groupedByMonth[monthKey];
                const dateParts = monthKey.split('-');
                const monthName = new Date(dateParts[0], dateParts[1] - 1).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

                return (
                    <div key={monthKey} className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 text-capitalize">{monthName}</h4>
                            <span className="badge bg-light text-dark fs-6 p-2">
                                {monthData.totalFacturas} Facturas Generadas
                            </span>
                        </div>
                        
                        <div className="card-body p-3">
                            <div className="alert alert-info d-flex justify-content-between align-items-center mb-3 p-3">
                                <span className="fw-bold text-dark">Ingreso Total por Mes:</span>
                                <span className="fs-4 fw-bolder text-dark">{formatARS(monthData.totalARS)}</span>
                            </div>

                            <h6 className="border-bottom pb-1 text-secondary">Detalle de Facturas:</h6>
                            
                            <ul className="list-group list-group-flush small">
                                {monthData.facturas.map((factura, index) => (
                                    <li key={factura.id || index} className="list-group-item d-flex justify-content-between align-items-center p-2">
                                        <div className="d-flex flex-column align-items-start">
                                            <span className="text-muted" style={{fontSize: '0.75rem'}}>
                                                {factura.datos.fecha} - Reserva N° {factura.datos.nReserva}
                                            </span>
                                            <span className="fw-bold text-dark">
                                                Cliente: {factura.datos.nombreCliente}
                                            </span>
                                        </div>
                                        
                                        <div className="d-flex align-items-center">
                                            <span className="text-dark fw-bold me-3">
                                                $ {factura.calculos.montoAbonarARS}
                                            </span>

                                            <button 
                                                className="btn btn-sm btn-danger me-2"
                                                onClick={() => onDeleteInvoice(factura.id)}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>

                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => onDownloadInvoice(factura)}
                                                title="Descargar"
                                            >
                                                ⬇️
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InvoiceHistory;