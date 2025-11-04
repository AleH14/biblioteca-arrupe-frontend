import React from 'react';
import { FiEye } from "react-icons/fi";
import styles from '../../../styles/NotificacionesCorreo.module.css';

const NotificacionesHistorial = React.memo(({ correosEnviados, onVerCorreo }) => {
  return (
    <div className={styles.historySection}>
      <h3 className={styles.sectionTitle}>Historial de Notificaciones</h3>
      
      {correosEnviados.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay notificaciones enviadas para este préstamo</p>
        </div>
      ) : (
        <div className={styles.correosList}>
          {correosEnviados.map((correo) => (
            <div key={correo.id} className={styles.correoItem}>
              <div className={styles.correoHeader}>
                <div className={styles.correoInfo}>
                  <strong className={styles.correoAsunto}>{correo.asunto}</strong>
                  <span className={styles.correoDestinatario}>{correo.destinatario}</span>
                  <span className={styles.correoFecha}>{correo.fecha}</span>
                </div>
                <div className={styles.correoActions}>
                  <button 
                    className={styles.actionBtn}
                    onClick={() => onVerCorreo(correo)}
                    title="Ver notificación"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
              <div className={styles.correoPreview}>
                {correo.mensaje.substring(0, 100)}...
              </div>
              <div className={styles.correoStatus}>
                <span className={styles.estadoEnviado}>{correo.estado}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

NotificacionesHistorial.displayName = 'NotificacionesHistorial';

export default NotificacionesHistorial;