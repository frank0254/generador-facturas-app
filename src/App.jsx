// src/App.jsx (Código Completo Modificado)

import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import FacturaForm from './components/FacturaForm'; 
import FacturaDisplay from './components/FacturaDisplay';
import InvoiceHistory from './components/InvoiceHistory'; 
import AlertMessage from './components/AlertMessage'; 
import ConfirmationModal from './components/ConfirmationModal'; // ⭐️ IMPORTAMOS EL NUEVO COMPONENTE
import './index.css'; 

const STORAGE_KEY = 'invoiceHistory';

const App = () => {
  
  const [currentView, setCurrentView] = useState('factura'); 
  const [invoiceToDownload, setInvoiceToDownload] = useState(null); 
  const pdfTargetRef = useRef(null); 
  const [isExpanding, setIsExpanding] = useState(false); 

  const [appAlert, setAppAlert] = useState({ message: '', type: 'success' });
  
  // ⭐️ NUEVO ESTADO para controlar el Modal de Confirmación
  const [modalConfirm, setModalConfirm] = useState({
      show: false,
      idToDelete: null,
      reservaNumber: null, // Para mostrar en el modal
  });

  const clearAlert = useCallback(() => {
    setAppAlert({ message: '', type: 'success' });
  }, []);

  const [datosFactura, setDatosFactura] = useState({
    // ... (Datos iniciales sin cambios) ...
    nReserva: '5841936485', 
    fecha: new Date().toISOString().slice(0, 10), 
    nombreCliente: 'Sebastian Amadini', 
    telefono: '+5492993330909',
    direccion: 'Turmalina 1529',
    localidad: 'Neuquén', 
    dni: '28623745',
    nacionalidad: 'Argentina', 
    codigoPostal: '8316', 
    email: 'sebastianama@hotmail.com',
    huespedes: 2, 
    formaPago: 'Transferencia Bancaria', 

    concepto: 'Reserva de Habitación ',
    precioUnitarioUSD: 51.30, 
    unidades: 2, 
    comisionBooking: 8.21, 
    señaUSD: 20.00, 
    tipoCambio: 900.00, 
  });

  const [invoicesHistory, setInvoicesHistory] = useState([]);
  
  // ... (useEffect para Cargar y Guardar sin cambios) ...
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      setInvoicesHistory(JSON.parse(savedHistory));
    }
  }, []); 

  useEffect(() => {
    if (invoicesHistory.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoicesHistory));
    }
    if (invoicesHistory.length === 0 && localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }, [invoicesHistory]); 

  // ... (handleInputChange, calcularFactura, saveInvoiceToHistory, handleDownloadAndExpand, downloadHistoricalInvoice sin cambios) ...

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let valor = value;
    
    if (type === 'number' || name.includes('USD') || name === 'tipoCambio' || name === 'unidades') {
        valor = Number(value) || 0; 
    }

    setDatosFactura((prev) => ({
      ...prev,
      [name]: valor,
    }));
  };

  const calcularFactura = () => {
    const { precioUnitarioUSD, unidades, comisionBooking, señaUSD, tipoCambio } = datosFactura;

    const pu = Number(precioUnitarioUSD);
    const u = Number(unidades);
    const cb = Number(comisionBooking);
    const s = Number(señaUSD);
    const tc = Number(tipoCambio) > 0 ? Number(tipoCambio) : 1; 
    
    const subtotalUSD = (pu * u) + cb;
    const iva = subtotalUSD * 0.21;
    const impuestoMunicipal = subtotalUSD * 0.15;
    const totalUSD = subtotalUSD + iva + impuestoMunicipal;
    const montoAbonarUSD = totalUSD - s;
    const montoAbonarARS = montoAbonarUSD * tc; 

    return {
      subtotalUSD: subtotalUSD.toFixed(2),
      iva: iva.toFixed(2),
      impuestoMunicipal: impuestoMunicipal.toFixed(2),
      totalUSD: totalUSD.toFixed(2),
      montoAbonarARS: montoAbonarARS.toFixed(2),
    };
  };

  const calculos = calcularFactura();

  const saveInvoiceToHistory = () => {
      const newInvoice = {
          id: Date.now(),
          datos: datosFactura,
          calculos: calculos
      };
      
      const updatedHistory = [newInvoice, ...invoicesHistory];
      setInvoicesHistory(updatedHistory);
      
      setAppAlert({ message: `¡Factura N° ${datosFactura.nReserva} generada y guardada con éxito!`, type: 'success' });
  };
  
  const handleDownloadAndExpand = () => {
    setIsExpanding(true); 
    setTimeout(() => {
        if (pdfTargetRef.current && pdfTargetRef.current.triggerPdfDownload) {
             pdfTargetRef.current.triggerPdfDownload({datos: datosFactura, calculos: calculos}); 
        }
        setIsExpanding(false); 
    }, 100); 
  };

  const downloadHistoricalInvoice = (invoice) => {
    setInvoiceToDownload(invoice);
    setTimeout(() => {
        if (pdfTargetRef.current && pdfTargetRef.current.triggerPdfDownload) {
            pdfTargetRef.current.triggerPdfDownload(invoice);
        }
        setInvoiceToDownload(null);
    }, 400); 
  };


    // ----------------------------------------------------------------
    // ⭐️ FUNCIÓN 1: Abre el Modal y establece el ID a borrar
    // ----------------------------------------------------------------
    const openDeleteModal = (idToDelete) => {
        // Encontramos el número de reserva asociado al ID para mostrarlo en el modal
        const invoice = invoicesHistory.find(inv => inv.id === idToDelete);
        const reservaNumber = invoice ? invoice.datos.nReserva : 'N/D';

        setModalConfirm({
            show: true,
            idToDelete: idToDelete,
            reservaNumber: reservaNumber,
        });
    };

    // ----------------------------------------------------------------
    // ⭐️ FUNCIÓN 2: Confirma la eliminación después de presionar "Sí, Eliminar" en el modal
    // ----------------------------------------------------------------
    const confirmDeleteInvoice = () => {
        const idToDelete = modalConfirm.idToDelete;
        
        const updatedHistory = invoicesHistory.filter(invoice => invoice.id !== idToDelete);
        
        setInvoicesHistory(updatedHistory);
        setModalConfirm({ show: false, idToDelete: null, reservaNumber: null }); // Cerrar modal

        setAppAlert({ message: 'Factura eliminada correctamente del historial.', type: 'danger' });
    };

    // ----------------------------------------------------------------
    // FUNCIÓN 3: Cierra el modal (para los botones de cancelar o la 'X')
    // ----------------------------------------------------------------
    const closeDeleteModal = () => {
        setModalConfirm({ show: false, idToDelete: null, reservaNumber: null });
    };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Generador de Facturas Hospedaje</h1>
      
      <AlertMessage alert={appAlert} onClearAlert={clearAlert} />

      {/* BOTONES DE VISTA (sin cambios) */}
      <div className="mb-4 text-center">
        <button 
          className={`btn me-2 ${currentView === 'factura' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setCurrentView('factura')}
        >
          Generador de Factura
        </button>
        <button 
          className={`btn ${currentView === 'historial' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setCurrentView('historial')}
        >
          📊 Ver Historial ({invoicesHistory.length})
        </button>
      </div>

      <div className="row">
        {currentView === 'factura' && (
          <>
            {!isExpanding && (
              <div className="col-md-3">
                <FacturaForm
                  datos={datosFactura}
                  onInputChange={handleInputChange} 
                />
              </div>
            )}
            
            <div className={isExpanding ? "col-md-12" : "col-md-9"}>
              <FacturaDisplay
                ref={pdfTargetRef}
                datos={datosFactura}
                calculos={calculos}
                onPdfGenerated={saveInvoiceToHistory}
                invoiceToDownload={invoiceToDownload} 
                onDownloadTrigger={handleDownloadAndExpand}
              />
            </div>
          </>
        )}
        
        {currentView === 'historial' && (
            <div className="col-12">
                <InvoiceHistory 
                    history={invoicesHistory} 
                    onDownloadInvoice={downloadHistoricalInvoice}
                      // ⭐️ PASAMOS LA FUNCIÓN QUE ABRE EL MODAL
                    onDeleteInvoice={openDeleteModal} 
                />
            </div>
        )}
      </div>
        
      {/* ⭐️ AGREGAMOS EL MODAL DE CONFIRMACIÓN AL FINAL */}
      <ConfirmationModal
          show={modalConfirm.show}
          handleClose={closeDeleteModal}
          handleConfirm={confirmDeleteInvoice}
          reservaNumber={modalConfirm.reservaNumber}
      />
    </div>
  );
};

export default App;