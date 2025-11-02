import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import styles from '../../styles/PrestamoVista.module.css';
import global from '../../styles/Global.module.css';

const NuevoPrestamoModal = React.memo(({ 
  show, 
  onClose, 
  formData, 
  onInputChange, 
  errores,
  ejemplaresSeleccionados,
  onEjemplarChange,
  onAddEjemplar,
  onRemoveEjemplar,
  fechaPrestamo,
  onFechaPrestamoChange,
  fechaDevolucion,
  onFechaDevolucionChange,
  onGuardar,
  guardando 
}) => {
  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Nuevo Préstamo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={onInputChange}
                  className={`${styles.inputForm} form-control ${
                    errores.usuarioId ? styles.inputError : ""
                  }`}
                  placeholder="Ingrese el nombre del usuario"
                  required
                />
                {errores.usuarioId && (
                  <div className={styles.errorMessage}>
                    {errores.usuarioId}
                  </div>
                )}
              </div>

              <label className="form-label">Ejemplar</label>
              {errores.ejemplares && (
                <div className={styles.errorMessage}>
                  {errores.ejemplares}
                </div>
              )}
              <br />
              {ejemplaresSeleccionados.map((ej, index) => (
                <div className="mb-3 d-flex" key={index}>
                  <input
                    type="text"
                    value={ej}
                    onChange={(e) => onEjemplarChange(index, e.target.value)}
                    className={`${styles.inputForm} form-control me-2 ${
                      errores.ejemplares ? styles.inputError : ""
                    }`}
                    placeholder="Ingrese el ejemplar"
                    required
                  />
                  {ejemplaresSeleccionados.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onRemoveEjemplar(index)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={onAddEjemplar}
              >
                + Añadir otro Ejemplar
              </button>

              <div className="mb-3">
                <label className="form-label">Fecha de Préstamo</label>
                <DatePicker
                  selected={fechaPrestamo}
                  onChange={onFechaPrestamoChange}
                  className={`${styles.datePickerInput} form-control ${
                    errores.fechaPrestamo ? styles.inputError : ""
                  }`}
                  placeholderText="Selecciona fecha"
                  dateFormat="yyyy-MM-dd"
                  required
                />
                {errores.fechaPrestamo && (
                  <div className={styles.errorMessage}>
                    {errores.fechaPrestamo}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Fecha de Devolución Estimada
                </label>
                <DatePicker
                  selected={fechaDevolucion}
                  onChange={onFechaDevolucionChange}
                  minDate={fechaPrestamo}
                  className={`${styles.datePickerInput} form-control ${
                    errores.fechaDevolucion ? styles.inputError : ""
                  }`}
                  placeholderText="Selecciona fecha"
                  dateFormat="yyyy-MM-dd"
                  required
                />
                {errores.fechaDevolucion && (
                  <div className={styles.errorMessage}>
                    {errores.fechaDevolucion}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`${global.btnPrimary} ${
                  guardando ? styles.loading : ""
                }`}
                onClick={onGuardar}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar Préstamo"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

NuevoPrestamoModal.displayName = 'NuevoPrestamoModal';

export default NuevoPrestamoModal;