// src/components/FacturaDisplay.jsx

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/logo hospedaje.jpeg'; 

// Recibe onDownloadTrigger desde App.jsx
const FacturaDisplay = forwardRef(({ datos, calculos, onPdfGenerated, invoiceToDownload, onDownloadTrigger }, ref) => {
  
  const dataToRender = invoiceToDownload ? invoiceToDownload.datos : datos;
  const calculationsToRender = invoiceToDownload ? invoiceToDownload.calculos : calculos;

  const componentRef = useRef(); 

  // --- FUNCIÓN CENTRAL DE DESCARGA (MAX ANCHO CON MARGEN 5MM Y ESCALA 2) ---
  const executePdfDownload = async (invoiceData, invoiceCalculations) => {
    const input = componentRef.current;
        
    // 1. Captura con ESCALA 2 (Ajuste para manejar el ancho completo sin fallos)
    const canvas = await html2canvas(input, {
      scale: 2, 
      useCORS: true, 
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight, 
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0); 
    
    // Dimensiones de la página A4 en mm
    const A4_WIDTH = 210;
    const A4_HEIGHT = 297; 
    
    // Márgenes de 5mm para maximizar el ancho
    const MARGIN = 5; 
    
    // Ancho útil para el contenido (210 - 10 = 200mm)
    const CONTENT_WIDTH = A4_WIDTH - (2 * MARGIN);
    
    // Calculamos la altura de la imagen si se ajusta al ancho de CONTENIDO (200mm)
    let imgHeight = (canvas.height * CONTENT_WIDTH) / canvas.width;
    
    let pdfWidthToUse = CONTENT_WIDTH;
    let pdfHeightToUse = imgHeight;
    let xOffset = MARGIN; 

    // 4. LÓGICA DE ESCALADO FORZADO: Si la altura excede el A4, escalamos
    if (imgHeight > A4_HEIGHT) {
        const scaleFactor = A4_HEIGHT / imgHeight;
        
        pdfWidthToUse = CONTENT_WIDTH * scaleFactor;
        pdfHeightToUse = A4_HEIGHT; 
        
        // Centrar el contenido horizontalmente en el A4
        xOffset = (A4_WIDTH - pdfWidthToUse) / 2;
    }
    
    // Inicializar jspdf con formato A4.
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    
    // Añadimos la imagen con las dimensiones y desplazamiento ajustados.
    pdf.addImage(imgData, 'JPEG', xOffset, 0, pdfWidthToUse, pdfHeightToUse);
    
    const filename = `Factura_HOUSE_CHE-CONQUISTA_${invoiceData.nReserva}.pdf`;
    pdf.save(filename);
    
    if (!invoiceToDownload && onPdfGenerated) {
        onPdfGenerated();
    }
  };
  
  useImperativeHandle(ref, () => ({
    triggerPdfDownload: (invoice) => {
      // Decide qué datos usar: los del historial (invoice) o los actuales
      const data = invoice ? invoice.datos : dataToRender;
      const calc = invoice ? invoice.calculos : calculationsToRender;
      executePdfDownload(data, calc);
    }
  }));

  const handleRegularDownload = () => {
    executePdfDownload(dataToRender, calculationsToRender);
  };
  
  const precioUnitarioDisplay = parseFloat(dataToRender.precioUnitarioUSD).toFixed(2);
  const comisionBookingDisplay = parseFloat(dataToRender.comisionBooking).toFixed(2);
  const señaUSDDisplay = parseFloat(dataToRender.señaUSD).toFixed(2);
  const totalConcepto = (dataToRender.precioUnitarioUSD * dataToRender.unidades + dataToRender.comisionBooking).toFixed(2);
  
  const direccionCompleta = `${dataToRender.direccion} - ${dataToRender.localidad} / CP: ${dataToRender.codigoPostal}`;

  return (
    <div>
      <button 
          className="btn btn-primary mb-3" 
          // Usa onDownloadTrigger (el que expande) si existe, sino usa la descarga regular (para historial)
          onClick={onDownloadTrigger || handleRegularDownload}
          disabled={!!invoiceToDownload} 
      >
        📥 Generar y Descargar PDF Profesional
      </button>

      <div ref={componentRef} className="bg-white factura-container border shadow-lg"> 
        
        {/* CABECERA Y LOGO */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 style={{fontSize: '2rem', fontWeight: '900', color: '#343a40', marginBottom: '0'}}>FACTURA</h2>
          </div>
          <div className="text-end">
            <img 
                src={logo} 
                alt="Logo Hospedaje HOUSE CHECONQUISTA" 
                style={{ height: '100px', maxWidth: '300px' }} 
            />
          </div>
        </div>

        <div className="franja-decorativa"></div>

        {/* DETALLES DEL CLIENTE Y RESERVA */}
        <div className="row mb-4 small">
            <div className="col-8">
                <p className="mb-0"><strong>Cliente:</strong> {dataToRender.nombreCliente}</p> 
                <p className="mb-0"><strong>Fecha:</strong> {dataToRender.fecha}</p>
                <p className="mb-0"><strong>Teléfono:</strong> {dataToRender.telefono}</p>
                <p className="mb-0"><strong>Dirección:</strong> {direccionCompleta}</p>
                <p className="mb-0"><strong>DNI:</strong> {dataToRender.dni} / Nacionalidad: {dataToRender.nacionalidad}</p>
                <p className="mb-0"><strong>Correo electrónico:</strong> {dataToRender.email}</p>
            </div>
            <div className="col-4 text-end">
                <p className="mb-0 text-muted">N° RESERVA</p>
                <h5 className="fw-bold text-dark">{dataToRender.nReserva}</h5>
            </div>
        </div>

        {/* TABLA DE CONCEPTOS */}
        <table className="table table-bordered table-sm tabla-conceptos mb-4">
          <thead className="franja-negra">
            <tr>
              <th className="text-start" style={{width: '35%'}}>Concepto</th>
              <th className="text-center">Precio</th>
              <th className="text-center">Unidades</th>
              <th className="text-center">Comisión y cargos por Booking</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-start">
                  {dataToRender.concepto} <br/>
                  <span className="text-muted">{dataToRender.unidades} Días (Huéspedes: {dataToRender.huespedes})</span>
              </td>
              <td className="text-end">{precioUnitarioDisplay}</td>
              <td className="text-center">{dataToRender.unidades}</td>
              <td className="text-end">{comisionBookingDisplay}</td>
              <td className="text-end fw-bold">{totalConcepto}</td>
            </tr>
          </tbody>
        </table>

        {/* TABLA DE CÁLCULOS Y TOTALES */}
        <div className="d-flex justify-content-end">
          <table className="table table-sm w-50 tabla-totales">
            <tbody>
              <tr>
                <td className="text-end">Subtotal</td>
                <td className="text-end fw-bold">{calculationsToRender.subtotalUSD} USD</td>
              </tr>
              <tr>
                <td className="text-end">IVA 21%</td>
                <td className="text-end">{calculationsToRender.iva}</td>
              </tr>
              <tr>
                <td className="text-end">Impuesto Municipal 15%</td>
                <td className="text-end">{calculationsToRender.impuestoMunicipal}</td>
              </tr>
              <tr className="fw-bold bg-secondary bg-opacity-25">
                <td className="text-end">TOTAL</td>
                <td className="text-end text-dark fs-5">USD {calculationsToRender.totalUSD}</td>
              </tr>
              <tr>
                <td className="text-end">SEÑA</td>
                <td className="text-end text-danger">-{señaUSDDisplay}</td>
              </tr>
              <tr className="fila-total-ars fw-bolder fs-4">
                <td className="text-end pt-2">Total a abonar</td>
                <td className="text-end pt-2 text-dark">ARS {calculationsToRender.montoAbonarARS}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* TÉRMINOS Y CONDICIONES */}
        <p className="small mt-4">
          Términos y condiciones<br/>
          El importe de esta factura está emitido en dólares USD, el cual se puede abonar en billete o en la moneda local pesos. El pago se realizará mediante **{dataToRender.formaPago}** al cambio de la tasa del día (TC): {dataToRender.tipoCambio.toFixed(2)}.
        </p>
        
        {/* PIE DE PÁGINA */}
        <div className="pie-factura">
            <p className="mb-1">
                @House_checonquista &nbsp;|&nbsp; 
                Calle Reconquista 533 Barrio San Nicolas &nbsp;|&nbsp; 
                (+54) 9 1133431596 &nbsp;|&nbsp; 
                Housereconquista@gmail.com
            </p>
            <p className="fw-bold mt-2 text-dark">GRACIAS POR ELEGIRNOS</p>
        </div>
        
      </div>
    </div>
  );
});

export default FacturaDisplay;