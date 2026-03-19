import React from 'react';

const FacturaForm = ({ datos, onInputChange, onAddItem, onRemoveItem, onUpdateItem }) => {
  return (
    <div className="card shadow-sm p-3 mb-4 bg-light">
      <h4 className="mb-3">Datos de la Factura</h4>
      
      {/* SECCIÓN 1: DATOS GENERALES */}
      <div className="mb-3">
        <label className="form-label small fw-bold">N° Reserva</label>
        <input type="text" className="form-control form-control-sm" name="nReserva" value={datos.nReserva} onChange={onInputChange} />
      </div>

      <div className="row g-2 mb-3">
        <div className="col-6">
          <label className="form-label small fw-bold">Check-In</label>
          <input type="date" className="form-control form-control-sm" name="fechaEntrada" value={datos.fechaEntrada} onChange={onInputChange} />
        </div>
        <div className="col-6">
          <label className="form-label small fw-bold">Check-Out</label>
          <input type="date" className="form-control form-control-sm" name="fechaSalida" value={datos.fechaSalida} onChange={onInputChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">Nombre del Cliente</label>
        <input type="text" className="form-control form-control-sm" name="nombreCliente" value={datos.nombreCliente} onChange={onInputChange} />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">DNI / CUIT</label>
        <input type="text" className="form-control form-control-sm" name="dni" value={datos.dni} onChange={onInputChange} />
      </div>

      {/* --- NUEVOS CAMPOS AGREGADOS --- */}
      <div className="mb-3">
        <label className="form-label small fw-bold">Teléfono</label>
        <input type="text" className="form-control form-control-sm" name="telefono" value={datos.telefono} onChange={onInputChange} />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">Dirección</label>
        <input type="text" className="form-control form-control-sm" name="direccion" value={datos.direccion} onChange={onInputChange} />
      </div>

      <div className="row g-2 mb-3">
        <div className="col-8">
          <label className="form-label small fw-bold">Localidad</label>
          <input type="text" className="form-control form-control-sm" name="localidad" value={datos.localidad} onChange={onInputChange} />
        </div>
        <div className="col-4">
          <label className="form-label small fw-bold">CP</label>
          <input type="text" className="form-control form-control-sm" name="codigoPostal" value={datos.codigoPostal} onChange={onInputChange} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold">Email</label>
        <input type="email" className="form-control form-control-sm" name="email" value={datos.email} onChange={onInputChange} />
      </div>
      {/* ------------------------------ */}

      <hr />

      {/* SECCIÓN 2: ÍTEMS DE LA FACTURA */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Conceptos</h5>
        <button className="btn btn-sm btn-success" onClick={onAddItem}>+ Añadir Fila</button>
      </div>

      {datos.items.map((item, index) => (
        <div key={item.id} className="border rounded p-2 mb-2 bg-white">
          <div className="d-flex justify-content-between mb-2">
            <span className="badge bg-secondary">Ítem #{index + 1}</span>
            {datos.items.length > 1 && (
              <button className="btn btn-sm btn-outline-danger py-0" onClick={() => onRemoveItem(item.id)}>x</button>
            )}
          </div>
          
          <div className="mb-2">
            <textarea 
              className="form-control form-control-sm" 
              placeholder="Descripción (ej: Habitación standard...)"
              value={item.descripcion}
              onChange={(e) => onUpdateItem(item.id, 'descripcion', e.target.value)}
              rows="2"
            />
          </div>

          <div className="row g-2">
            <div className="col-4">
              <label className="small">Noches</label>
              <input type="number" className="form-control form-control-sm" value={item.unidades} onChange={(e) => onUpdateItem(item.id, 'unidades', Number(e.target.value))} />
            </div>
            <div className="col-4">
              <label className="small">Rango</label>
              <input type="text" className="form-control form-control-sm" placeholder="21 al 22" value={item.rangoFechas} onChange={(e) => onUpdateItem(item.id, 'rangoFechas', e.target.value)} />
            </div>
            <div className="col-4">
              <label className="small">Precio (USD)</label>
              <input type="number" className="form-control form-control-sm" value={item.precioUnitario} onChange={(e) => onUpdateItem(item.id, 'precioUnitario', Number(e.target.value))} />
            </div>
          </div>
        </div>
      ))}

      <hr />

      {/* SECCIÓN 3: CONFIGURACIÓN ECONÓMICA */}
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label small fw-bold">Tipo Cambio</label>
          <input type="number" className="form-control form-control-sm" name="tipoCambio" value={datos.tipoCambio} onChange={onInputChange} />
        </div>
        <div className="col-6">
          <label className="form-label small fw-bold">Seña (%)</label>
          <input type="number" className="form-control form-control-sm" name="señaUSD" value={datos.señaUSD} onChange={onInputChange} />
        </div>
      </div>
    </div>
  );
};

export default FacturaForm;