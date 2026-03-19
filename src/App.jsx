import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import FacturaForm from './components/FacturaForm'; 
import FacturaDisplay from './components/FacturaDisplay';
import InvoiceHistory from './components/InvoiceHistory'; 
import AlertMessage from './components/AlertMessage'; 
import ConfirmationModal from './components/ConfirmationModal';
import './index.css'; 

const STORAGE_KEY = 'invoiceHistory';

const App = () => {
  const [currentView, setCurrentView] = useState('factura'); 
  const pdfTargetRef = useRef(null); 
  const [isExpanding, setIsExpanding] = useState(false); 
  const [appAlert, setAppAlert] = useState({ message: '', type: 'success' });
  
  const [modalConfirm, setModalConfirm] = useState({
      show: false,
      idToDelete: null,
      reservaNumber: null,
  });

  const clearAlert = useCallback(() => {
    setAppAlert({ message: '', type: 'success' });
  }, []);

  const [datosFactura, setDatosFactura] = useState({
    nReserva: '5029376938', 
    fecha: new Date().toISOString().slice(0, 10),
    fechaEntrada: '2026-03-19', 
    fechaSalida: '2026-03-23',  
    nombreCliente: 'Arrieta Duca Guadalupe', 
    telefono: '+54 3546 41 7425',
    direccion: 'Independencia 369',
    localidad: 'Cordoba', 
    dni: '27-44657996-2', 
    nacionalidad: 'Argentina', 
    codigoPostal: '5000', 
    email: 'ag.400890@guest.booking.com',
    huespedes: 2, 
    formaPago: 'Transferencia Bancaria', 
    tipoCambio: 1435.00, 
    señaUSD: 5.00, 

    items: [
      {
        id: Date.now(),
        descripcion: 'Habitación estandard Rate...',
        rangoFechas: '21 al 22',
        precioUnitario: 80.00,
        unidades: 1,
      }
    ]
  });

  const [invoicesHistory, setInvoicesHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) setInvoicesHistory(JSON.parse(savedHistory));
  }, []); 

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoicesHistory));
  }, [invoicesHistory]); 

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let valor = type === 'number' ? (Number(value) || 0) : value;
    setDatosFactura(prev => ({ ...prev, [name]: valor }));
  };

  const addItem = () => {
    const newItem = { id: Date.now(), descripcion: '', rangoFechas: '', precioUnitario: 0, unidades: 1 };
    setDatosFactura(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id) => {
    if (datosFactura.items.length > 1) {
      setDatosFactura(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    }
  };

  const updateItem = (id, field, value) => {
    setDatosFactura(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  // 🧮 LÓGICA DE CÁLCULO ACTUALIZADA
  const calcularFactura = () => {
    const { items, señaUSD, tipoCambio } = datosFactura;

    const subtotalBase = items.reduce((acc, item) => {
      return acc + (item.precioUnitario * item.unidades);
    }, 0);

    const comisionMuni = subtotalBase * 0.0625; // 6.25%
    const iva = subtotalBase * 0.21; // 21%
    const totalUSD = subtotalBase + comisionMuni + iva;
    const valorSeñaUSD = totalUSD * (señaUSD / 100); 
    const montoAbonarARS = (totalUSD - valorSeñaUSD) * tipoCambio;

    return {
      subtotalUSD: subtotalBase.toFixed(2),
      iva: iva.toFixed(2),
      impuestoMunicipal: comisionMuni.toFixed(2),
      totalUSD: totalUSD.toFixed(2),
      valorSeñaUSD: valorSeñaUSD.toFixed(2),
      montoAbonarARS: Math.round(montoAbonarARS).toLocaleString('es-AR'),
    };
  };

  // ✅ AQUÍ SE DEFINE LA VARIABLE PARA QUE NO DE ERROR
  const calculos = calcularFactura();

  const saveInvoiceToHistory = () => {
    // 1. Calculamos los valores en el momento exacto de guardar
    const resultadosActuales = calcularFactura(); 
    
    const newInvoice = { 
        id: Date.now(), 
        datos: { ...datosFactura }, // Guardamos una copia de los datos
        calculos: resultadosActuales 
    };

    setInvoicesHistory([newInvoice, ...invoicesHistory]);
    setAppAlert({ 
        message: `¡Factura N° ${datosFactura.nReserva} guardada en el historial!`, 
        type: 'success' 
    });
};

  const handleDownloadAndExpand = () => {
    setIsExpanding(true); 
    setTimeout(() => {
        if (pdfTargetRef.current?.triggerPdfDownload) {
             pdfTargetRef.current.triggerPdfDownload(); 
        }
        setIsExpanding(false); 
    }, 100); 
  };

  const confirmDeleteInvoice = () => {
    setInvoicesHistory(invoicesHistory.filter(inv => inv.id !== modalConfirm.idToDelete));
    setModalConfirm({ show: false, idToDelete: null, reservaNumber: null });
    setAppAlert({ message: 'Eliminado.', type: 'danger' });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 fw-bold">PRO Generador de Facturas</h1>
      <AlertMessage alert={appAlert} onClearAlert={clearAlert} />

      <div className="mb-4 text-center">
        <button className={`btn me-2 ${currentView === 'factura' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setCurrentView('factura')}>
          Nueva Factura
        </button>
        <button className={`btn ${currentView === 'historial' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setCurrentView('historial')}>
          Historial ({invoicesHistory.length})
        </button>
      </div>

      <div className="row">
        {currentView === 'factura' && (
          <>
            {!isExpanding && (
              <div className="col-md-4">
                <FacturaForm
                  datos={datosFactura}
                  onInputChange={handleInputChange} 
                  onAddItem={addItem}
                  onRemoveItem={removeItem}
                  onUpdateItem={updateItem}
                />
              </div>
            )}
            <div className={isExpanding ? "col-md-12" : "col-md-8"}>
              <FacturaDisplay
                ref={pdfTargetRef}
                datos={datosFactura}
                calculos={calculos}
                onPdfGenerated={saveInvoiceToHistory}
                onDownloadTrigger={handleDownloadAndExpand}
              />
            </div>
          </>
        )}
        
        {currentView === 'historial' && (
            <div className="col-12">
                <InvoiceHistory 
                    history={invoicesHistory} 
                    onDownloadInvoice={(inv) => {
                        pdfTargetRef.current?.triggerPdfDownload(inv);
                    }}
                    onDeleteInvoice={(id) => {
                      const inv = invoicesHistory.find(i => i.id === id);
                      setModalConfirm({ show: true, idToDelete: id, reservaNumber: inv?.datos.nReserva });
                    }} 
                />
            </div>
        )}
      </div>

      <ConfirmationModal
          show={modalConfirm.show}
          handleClose={() => setModalConfirm({show: false})}
          handleConfirm={confirmDeleteInvoice}
          reservaNumber={modalConfirm.reservaNumber}
      />
    </div>
  );
};

export default App;