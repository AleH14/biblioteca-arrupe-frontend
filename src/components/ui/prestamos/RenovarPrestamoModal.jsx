import React from 'react';
import DatePicker from 'react-datepicker';
import styles from '../../../styles/PrestamoVista.module.css';

const RenovarPrestamoModal = React.memo(({ 
  show, 
  onClose, 
  prestamo,
  nuevaFechaDevolucion,
  onFechaChange,
  errorRenovacion,
  onRenovar,
  formatearFecha 
}) => {
  if (!show || !prestamo) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Renovar Préstamo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className={styles.confirmacionContent}>
              {/* Información del préstamo */}
              <div className={styles.confirmacionInfo}>
                <p><strong>Usuario:</strong> {prestamo.usuario}</p>
                <p><strong>Libro:</strong> {prestamo.libro}</p>
                <p><strong>Fecha préstamo:</strong> {formatearFecha(prestamo.fechaPrestamo)}</p>
                <p><strong>Fecha devolución actual:</strong> {formatearFecha(prestamo.fechaDevolucionEstimada)}</p>
              </div>

              {/* Nueva fecha de renovación */}
              <div className={styles.datepickerContainer}>
                <label className="form-label"><strong>Nueva fecha de devolución:</strong></label>
                <div className={styles.datepickerWrapper}>
                  <DatePicker
                    selected={nuevaFechaDevolucion}
                    onChange={onFechaChange}
                    minDate={new Date()}
                    className={`${styles.datePickerInput} form-control`}
                    placeholderText="Selecciona nueva fecha"
                    dateFormat="yyyy-MM-dd"
                  />
                  
                  <div className={styles.datepickerError}>
                    {errorRenovacion || ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onRenovar}
            >
              Renovar Préstamo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

RenovarPrestamoModal.displayName = 'RenovarPrestamoModal';

export default RenovarPrestamoModal;