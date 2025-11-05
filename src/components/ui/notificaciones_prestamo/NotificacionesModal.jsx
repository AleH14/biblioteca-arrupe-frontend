//MODAL DE VER DETALLER DE CORREO EN NOTIFICACIONES
import React from 'react';
import styles from '../../../styles/NotificacionesCorreo.module.css';

const NotificacionesModal = React.memo(({ 
  correoSeleccionado, 
  onClose 
}) => {
  if (!correoSeleccionado) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className={`modal-title ${styles.modalTitulo}`}>
              {correoSeleccionado.asunto}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className={styles.correoDetalle}>
              <div className={styles.detalleItem}>
                <strong>Destinatario:</strong> {correoSeleccionado.destinatario}
              </div>
              <div className={styles.detalleItem}>
                <strong>Fecha:</strong> {correoSeleccionado.fecha}
              </div>
              <div className={styles.detalleItem}>
                <strong>Estado:</strong> 
                <span className={styles.estadoEnviado}> {correoSeleccionado.estado}</span>
              </div>
              <div className={styles.detalleMensaje}>
                <strong>Mensaje:</strong>
                <div className={styles.mensajeContenido}>
                  {correoSeleccionado.mensaje}
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
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

NotificacionesModal.displayName = 'NotificacionesModal';

export default NotificacionesModal;