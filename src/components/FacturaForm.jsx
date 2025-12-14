// src/components/FacturaForm.jsx

import React from 'react';

const FacturaForm = ({ datos, onInputChange }) => {
  return (
    <div className="card shadow-sm p-3 mb-4">
      <h3 className="card-title text-primary mb-3">Datos del Cliente y Reserva</h3>
      
      {/* DATOS DE IDENTIFICACIÓN Y CONTACTO */}
      <div className="mb-3">
        <label className="form-label small">Nombre y Apellido</label>
        <input type="text" name="nombreCliente" value={datos.nombreCliente} onChange={onInputChange} className="form-control form-control-sm" />
      </div>
      <div className="mb-3">
        <label className="form-label small">DNI / Documento</label>
        <input type="text" name="dni" value={datos.dni} onChange={onInputChange} className="form-control form-control-sm" />
      </div>
      <div className="mb-3">
        <label className="form-label small">Nacionalidad</label>
        <input type="text" name="nacionalidad" value={datos.nacionalidad} onChange={onInputChange} className="form-control form-control-sm" />
      </div>
      <div className="mb-3">
        <label className="form-label small">Teléfono</label>
        <input type="text" name="telefono" value={datos.telefono} onChange={onInputChange} className="form-control form-control-sm" />
      </div>
      <div className="mb-3">
        <label className="form-label small">E-mail</label>
        <input type="email" name="email" value={datos.email} onChange={onInputChange} className="form-control form-control-sm" />
      </div>
      
      {/* DIRECCIÓN Y LOCALIDAD */}
      <div className="mb-3">
        <label className="form-label small">Dirección</label>
        <input type="text" name="direccion" value={datos.direccion} onChange={onInputChange} className="form-control form-control-sm" />
      </div>
      <div className="row">
        <div className="col-md-8 mb-3">
            <label className="form-label small">Localidad</label>
            <input type="text" name="localidad" value={datos.localidad} onChange={onInputChange} className="form-control form-control-sm" />
        </div>
        <div className="col-md-4 mb-3">
            <label className="form-label small">Cód. Postal</label>
            <input type="text" name="codigoPostal" value={datos.codigoPostal} onChange={onInputChange} className="form-control form-control-sm" />
        </div>
      </div>

      <hr/>

      {/* DATOS DE ESTADÍA Y PRECIOS */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label small">Días de Estadía</label>
          <input type="number" name="unidades" value={datos.unidades} onChange={onInputChange} className="form-control form-control-sm" min="1" />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label small">N° de Huéspedes</label>
          <input type="number" name="huespedes" value={datos.huespedes} onChange={onInputChange} className="form-control form-control-sm" min="1" />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small">Precio x Noche (USD)</label>
        <input type="number" name="precioUnitarioUSD" value={datos.precioUnitarioUSD} onChange={onInputChange} className="form-control form-control-sm" min="0" step="0.01" />
      </div>
      <div className="mb-3">
        <label className="form-label small">Comisión/Cargos Booking (USD)</label>
        <input type="number" name="comisionBooking" value={datos.comisionBooking} onChange={onInputChange} className="form-control form-control-sm" min="0" step="0.01" />
      </div>
      <div className="mb-3">
        <label className="form-label small">Seña (USD)</label>
        <input type="number" name="señaUSD" value={datos.señaUSD} onChange={onInputChange} className="form-control form-control-sm" min="0" step="0.01" />
      </div>
      <div className="mb-3">
        <label className="form-label small">Tipo de Cambio Actual (TC)</label>
        <input type="number" name="tipoCambio" value={datos.tipoCambio} onChange={onInputChange} className="form-control form-control-sm" min="1" step="0.01" />
      </div>
      <div className="mb-3">
        <label className="form-label small">Forma de Pago</label>
        <select name="formaPago" value={datos.formaPago} onChange={onInputChange} className="form-select form-select-sm">
            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
            <option value="Efectivo">Efectivo</option>
        </select>
      </div>

    </div>
  );
};

export default FacturaForm;