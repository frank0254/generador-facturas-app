import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/logo hospedaje.jpeg'; 

const FacturaDisplay = forwardRef(({ datos, calculos, onPdfGenerated, onDownloadTrigger }, ref) => {
  const componentRef = useRef(); 

  const executePdfDownload = async () => {
    const input = componentRef.current;
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Factura_${datos.nReserva}.pdf`);
    
    if (onPdfGenerated) onPdfGenerated();
  };

  useImperativeHandle(ref, () => ({
    triggerPdfDownload: executePdfDownload
  }));

  return (
    <div>
      <button className="btn btn-primary mb-3 w-100" onClick={onDownloadTrigger}>
        📥 Generar y Descargar PDF Profesional
      </button>

      {/* CONTENEDOR DE LA FACTURA */}
      <div ref={componentRef} className="bg-white p-5 shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm', color: '#333', fontFamily: 'Arial, sans-serif' }}>
        
        {/* ENCABEZADO */}
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div style={{ backgroundColor: '#E5D3C5', padding: '10px 40px', borderRadius: '2px' }}>
            <h1 className="m-0 fw-bold" style={{ letterSpacing: '2px' }}>RECIBO</h1>
          </div>
          <img src={logo} alt="Logo" style={{ height: '80px' }} />
        </div>

        {/* INFO CLIENTE Y FACTURA */}
        <div className="row mb-5">
          <div className="col-7">
            <h6 className="fw-bold text-uppercase mb-3">DESTINATARIO:</h6>
            <p className="mb-1 fw-bold">{datos.nombreCliente}</p>
            <p className="mb-1 small">Dirección: {datos.direccion} {datos.localidad} {datos.codigoPostal}</p>
            <p className="mb-1 small">Teléfono: {datos.telefono}</p>
            <p className="mb-1 small text-decoration-underline">CUIT/DNI: {datos.dni}</p>
            <p className="mb-1 small">Mail: {datos.email}</p>
          </div>
          <div className="col-5 text-end">
            <div className="mb-2"><span className="fw-bold">FACTURA:</span> <span className="ms-3">{datos.nReserva}</span></div>
            <div className="mb-2"><span className="fw-bold text-uppercase small">Fecha Entrada:</span> <span className="ms-3">{datos.fechaEntrada}</span></div>
            <div className="mb-2"><span className="fw-bold text-uppercase small">Fecha Salida:</span> <span className="ms-3">{datos.fechaSalida}</span></div>
          </div>
        </div>

        {/* TABLA DE CONCEPTOS CORREGIDA */}
        <table className="table table-borderless mb-5">
          <thead style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>
            <tr className="small fw-bold text-uppercase">
              <th style={{ width: '40%' }}>Habitación</th>
              <th className="text-center">Dia - Noche</th>
              <th className="text-center">Precio</th>
              <th className="text-center">Comisión / Imp. Municipal</th>
              <th className="text-end">IVA</th>
            </tr>
          </thead>
          <tbody className="small">
            {datos.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td className="py-3">{item.descripcion}</td>
                <td className="py-3 text-center">{item.rangoFechas}</td>
                <td className="py-3 text-center">US${item.precioUnitario.toFixed(2)}</td>
                <td className="py-3 text-center">US$ {(item.precioUnitario * item.unidades * 0.0625).toFixed(2)}</td>
                <td className="py-3 text-end">US$ {(item.precioUnitario * item.unidades * 0.21).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* DETALLES DE PAGO Y TOTALES */}
        <div className="row mt-5">
          <div className="col-6">
            <div className="border p-3 rounded" style={{ fontSize: '0.85rem', backgroundColor: '#fcfcfc' }}>
              <p className="fw-bold mb-2">DETALLES PAGO:</p>
              <p className="mb-1">Alias Mercado Pago: <span className="text-decoration-underline">Housecheconquista</span></p>
              <p className="mb-1">Bnco Provincia N° Cta: 0140001403400153624233</p>
              <p className="mb-1">Titular: Deisire Diaz Torrenegra</p>
              <p className="mb-3">Pago efectivo</p>
              <p className="fw-bold mb-1">CONDICIONES DE PAGO:</p>
              <p className="m-0 italic text-muted">El pago se realizara una vez ingresado al alojamiento antes de entregarles las llaves de la habitación</p>
            </div>
          </div>
          
          <div className="col-6">
            <table className="table table-bordered border-dark">
              <tbody className="small fw-bold">
                <tr>
                  <td className="p-2 text-uppercase bg-light">Sub-total</td>
                  <td className="p-2 text-end">US$ {calculos.subtotalUSD}</td>
                </tr>
                <tr>
                  <td className="p-2 text-uppercase bg-light">IVA (21%)</td>
                  <td className="p-2 text-end">US$ {calculos.iva}</td>
                </tr>
                <tr>
                  <td className="p-2 text-uppercase bg-light">Impuesto Municipal</td>
                  <td className="p-2 text-end">US$ {calculos.impuestoMunicipal}</td>
                </tr>
                <tr className="table-active">
                  <td className="p-2 text-uppercase">Total USD</td>
                  <td className="p-2 text-end text-decoration-underline">US$ {calculos.totalUSD}</td>
                </tr>
                <tr>
                  <td className="p-2 text-uppercase bg-light">Seña {datos.señaUSD}%</td>
                  <td className="p-2 text-end text-danger">-US$ {calculos.valorSeñaUSD}</td>
                </tr>
                <tr style={{ fontSize: '1.2rem', backgroundColor: '#f8f9fa' }}>
                  <td className="p-2 text-uppercase">Total ARS (TC {datos.tipoCambio})</td>
                  <td className="p-2 text-end text-decoration-underline">$ {calculos.montoAbonarARS}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pt-5 text-center small text-muted">
          <h6 className="fw-bold text-dark">GRACIAS POR SU CONFIANZA Y PREFERENCIA.</h6>
          <p className="mb-0 mt-3" style={{ fontSize: '0.7rem' }}>
            House Checonquista | Dirección: Reconquista 533 , Piso 4 / Barrio san Nicolas | CP: C001A003 | Teléfono: +54 9 1133431596 | Mail: housereconquista@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
});

export default FacturaDisplay;