import React from 'react';
import { FiUser, FiBook, FiMapPin, FiCalendar } from 'react-icons/fi';
import styles from '../../../styles/PrestamoVista.module.css';

const DetallesPrestamoModal = React.memo(({ 
  show, 
  onClose, 
  prestamo, 
  formatearFecha,
  obtenerEstadoVisual,
  obtenerClaseEstado 
}) => {
  if (!show || !prestamo) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Préstamo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className={styles.detallesContent}>
              <div className={styles.detalleItem}>
                <FiUser className={styles.detalleIcon} />
                <div>
                  <strong>Usuario:</strong>
                  <span>{prestamo.usuario}</span>
                </div>
              </div>
              <div className={styles.detalleItem}>
                <FiBook className={styles.detalleIcon} />
                <div>
                  <strong>Libro:</strong>
                  <span>{prestamo.libro}</span>
                </div>
              </div>

              <div className={styles.detalleItem}>
                <FiMapPin className={styles.detalleIcon} />
                <div>
                  <strong>Ubicación:</strong>
                  <span>
                    {prestamo.ejemplar?.ubicacionFisica || 'No especificada'}
                    {prestamo.ejemplar?.edificio && ` - Edificio ${prestamo.ejemplar.edificio}`}
                  </span>
                </div>
              </div>

              <div className={styles.detalleItem}>
                <FiCalendar className={styles.detalleIcon} />
                <div>
                  <strong>Fecha de Préstamo:</strong>
                  <span>{formatearFecha(prestamo.fechaPrestamo)}</span>
                </div>
              </div>
              <div className={styles.detalleItem}>
                <FiCalendar className={styles.detalleIcon} />
                <div>
                  <strong>Fecha Devolución Estimada:</strong>
                  <span>{formatearFecha(prestamo.fechaDevolucionEstimada)}</span>
                </div>
              </div>
              <div className={styles.detalleItem}>
                <FiCalendar className={styles.detalleIcon} />
                <div>
                  <strong>Fecha Devolución Real:</strong>
                  <span
                    className={
                      prestamo.fechaDevolucionReal
                        ? styles.fechaReal
                        : styles.fechaPendiente
                    }
                  >
                    {prestamo.fechaDevolucionReal
                      ? formatearFecha(prestamo.fechaDevolucionReal)
                      : "Pendiente"}
                  </span>
                </div>
              </div>
              <div className={styles.detalleItem}>
                <div className={styles.estadoContainer}>
                  <strong>Estado:</strong>
                  <span className={obtenerClaseEstado(prestamo)}>
                    {obtenerEstadoVisual(prestamo)}
                  </span>
                </div>
              </div>
              {prestamo.notificaciones && prestamo.notificaciones.length > 0 && (
                <div className={styles.notificacionesSection}>
                  <h6>Notificaciones Enviadas</h6>
                  {prestamo.notificaciones.map((notif, index) => (
                    <div key={index} className={styles.notificacionItem}>
                      <small>
                        <strong>{notif.asunto}</strong> -{" "}
                        {formatearFecha(notif.fechaEnvio)}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DetallesPrestamoModal.displayName = 'DetallesPrestamoModal';

export default DetallesPrestamoModal;