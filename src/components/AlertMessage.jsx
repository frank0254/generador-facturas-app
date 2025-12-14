// src/components/AlertMessage.jsx

import React, { useEffect } from 'react';

// Recibe un objeto 'alert' con { message, type } y la función para limpiarlo.
const AlertMessage = ({ alert, onClearAlert }) => {
    
    // Si no hay mensaje, no renderiza nada
    if (!alert.message) {
        return null;
    }

    // Efecto para ocultar el mensaje automáticamente después de 4 segundos
    useEffect(() => {
        const timer = setTimeout(() => {
            onClearAlert();
        }, 4000); // 4000 milisegundos = 4 segundos

        // Función de limpieza para cancelar el timeout si el componente se desmonta 
        // o si un nuevo mensaje llega antes de que el anterior expire.
        return () => clearTimeout(timer);
    }, [alert, onClearAlert]);


    // Define la clase de Bootstrap basada en el tipo (success, danger, info, etc.)
    const alertClass = `alert alert-${alert.type} alert-dismissible fade show`;

    return (
        <div className="row justify-content-center mb-4">
            <div className="col-md-8 col-lg-6">
                <div className={alertClass} role="alert">
                    {alert.message}
                    {/* Botón para que el usuario pueda cerrarlo manualmente */}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClearAlert}></button>
                </div>
            </div>
        </div>
    );
};

export default AlertMessage;