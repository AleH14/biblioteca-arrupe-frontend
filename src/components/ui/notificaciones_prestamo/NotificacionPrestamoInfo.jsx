//PRIMER CARD EN NOTIFICACIONES DETALLE DEL PRESTAMO
import React from 'react';
import styles from '../../../styles/NotificacionesCorreo.module.css';

const NotificacionPrestamoInfo = React.memo(({ prestamo }) => {
  
  if (!prestamo) return null;

  const infoPrestamo = {
    usuario: prestamo.usuario,
    libro: prestamo.libro,
    fechaPrestamo: new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES'),
    fechaDevolucion: prestamo.fechaDevolucionEstimada ? 
      new Date(prestamo.fechaDevolucionEstimada).toLocaleDateString('es-ES') : 'No definida',
    estado: prestamo.estado
  };

  return (
    <div className={styles.prestamoInfo}>
      <h4 className={styles.prestamoTitle}>Información del Préstamo</h4>
      <div className="row">
        <div className="col-md-6">
          <div className={styles.infoItem}>
            <strong>Usuario:</strong> {infoPrestamo.usuario}
          </div>
          <div className={styles.infoItem}>
            <strong>Libro:</strong> {infoPrestamo.libro}
          </div>
        </div>
        <div className="col-md-6">
          <div className={styles.infoItem}>
            <strong>Fecha Préstamo:</strong> {infoPrestamo.fechaPrestamo}
          </div>
          <div className={styles.infoItem}>
            <strong>Devolución Estimada:</strong> {infoPrestamo.fechaDevolucion}
          </div>
        </div>
      </div>
    </div>
  );
});

NotificacionPrestamoInfo.displayName = 'NotificacionPrestamoInfo';

export default NotificacionPrestamoInfo;