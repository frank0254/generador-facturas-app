// src/components/ConfirmationModal.jsx

import React from 'react';

// Recibe:
// - show: boolean para mostrar/ocultar
// - handleClose: función para cerrar el modal
// - handleConfirm: función que se ejecuta al presionar 'Sí, Eliminar'
const ConfirmationModal = ({ show, handleClose, handleConfirm, reservaNumber }) => {
    
    // Si 'show' es falso, no renderizamos el modal en absoluto.
    if (!show) {
        return null;
    }

    // ⭐️ CAMBIOS CLAVE:
    // 1. Ya no usamos 'modalStyle' en el div principal.
    // 2. Usamos el CSS estándar de Bootstrap para centrar y el posicionamiento.
    // 3. NO hay ninguna propiedad 'backgroundColor' ni capa de fondo.

    return (
        // El div principal tiene la clase 'modal' y 'd-block' (display: block) para forzar su visibilidad.
        // La clase 'fade show' maneja la transición de entrada.
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-modal="true" aria-hidden={false}>
            <div className="modal-dialog modal-dialog-centered" role="document"></div>
            {/* ⚠️ NOTA: El modal ya no tiene fondo oscuro */}
            
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    
                    {/* Encabezado del Modal */}
                    <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title">⚠️ Confirmar Eliminación</h5>
                        {/* El 'btn-close-white' asegura que la X se vea bien sobre el fondo rojo */}
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose} aria-label="Cerrar"></button>
                    </div>
                    
                    {/* Cuerpo del Modal */}
                    <div className="modal-body">
                        <p>
                            ¿Estás seguro de que deseas eliminar la factura de la Reserva N° {reservaNumber} del historial?
                        </p>
                        <p className="text-danger small">
                            Esta acción es irreversible.
                        </p>
                    </div>
                    
                    {/* Footer del Modal con botones de acción */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleClose}
                        >
                            No, Cancelar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={handleConfirm}
                        >
                            Sí, Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        // ❌ No se renderiza el div 'modal-backdrop' de Bootstrap, por lo tanto, no hay fondo oscuro.
    );
};

export default ConfirmationModal;