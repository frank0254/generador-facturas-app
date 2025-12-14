// src/components/InvoiceHistory.jsx

import React from 'react';

// Acepta una nueva prop: onDeleteInvoice
const InvoiceHistory = ({ history, onDownloadInvoice, onDeleteInvoice }) => {
    
    const formatARS = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(amount);
    };
    
    if (history.length === 0) {
        return (
            <div className="alert alert-info">
                Aún no has generado ninguna factura.
            </div>
        );
    }
    
    const groupedByMonth = history.reduce((acc, factura) => {
        // Utilizamos factura.datos.fecha que es un string y funciona bien con Date
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
        // Aseguramos que se sumen números
        acc[key].totalARS += parseFloat(factura.calculos.montoAbonarARS);
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
                        {/* CABECERA */}
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 text-capitalize">{monthName}</h4>
                            <span className="badge bg-light text-dark fs-6 p-2">
                                {monthData.totalFacturas} Facturas Generadas
                            </span>
                        </div>
                        
                        {/* CUERPO DEL RESUMEN */}
                        <div className="card-body p-3">
                            <div className="alert alert-info d-flex justify-content-between align-items-center mb-3 p-3">
                                <span className="fw-bold text-dark">Ingreso Total por Mes:</span>
                                <span className="fs-4 fw-bolder text-dark">{formatARS(monthData.totalARS)}</span>
                            </div>

                            <h6 className="border-bottom pb-1 text-secondary">Detalle de Facturas:</h6>
                            
                            {/* DETALLE DE FACTURAS */}
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
                                        
                                        {/* CONTENEDOR DE BOTONES Y MONTO */}
                                        <div className="d-flex align-items-center">
                                            <span className="text-dark fw-bold me-3">
                                                {formatARS(factura.calculos.montoAbonarARS)}
                                            </span>

                                            {/* NUEVO BOTÓN DE ELIMINAR */}
                                            <button 
                                                className="btn btn-sm btn-danger me-2" // Color rojo para eliminar
                                                // Llama a la función de App.jsx con el ID de la factura
                                                onClick={() => onDeleteInvoice(factura.id)}
                                                title="Eliminar esta factura del historial"
                                            >
                                                🗑️
                                            </button>

                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => onDownloadInvoice(factura)}
                                                title="Descargar esta factura en PDF"
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