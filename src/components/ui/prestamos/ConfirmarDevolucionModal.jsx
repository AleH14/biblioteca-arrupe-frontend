import React from 'react';
import styles from '../../../styles/PrestamoVista.module.css';

const ConfirmarDevolucionModal = React.memo(({ 
  show, 
  onClose, 
  prestamo, 
  onConfirmar,
  formatearFecha 
}) => {
  if (!show || !prestamo) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar Devolución</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className={styles.confirmacionContent}>
              <h6>¿Está seguro que desea registrar la devolución?</h6>
              <div className={styles.confirmacionInfo}>
                <p><strong>Libro:</strong> {prestamo.libro}</p>
                <p><strong>Usuario:</strong> {prestamo.usuario}</p>
                <p>
                  <strong>Ubicación:</strong>{' '}
                  {prestamo.ejemplar?.ubicacionFisica || 'No especificada'}
                  {prestamo.ejemplar?.edificio && ` - Edificio ${prestamo.ejemplar.edificio}`}
                </p>
                <p><strong>Fecha préstamo:</strong> {formatearFecha(prestamo.fechaPrestamo)}</p>
                <p><strong>Vencía:</strong> {formatearFecha(prestamo.fechaDevolucionEstimada)}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              onClick={onConfirmar}
            >
              Confirmar Devolución
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ConfirmarDevolucionModal.displayName = 'ConfirmarDevolucionModal';

export default ConfirmarDevolucionModal;