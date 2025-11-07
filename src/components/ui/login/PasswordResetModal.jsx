// ¿Olvidate tu contraseña?
'use client';

import React from 'react';
import styles from "@/styles/LoginForm.module.css";

const PasswordResetModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Recuperación de Contraseña</h5>
          <button 
            type="button" 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.modalIcon}>
            <i className="bi bi-shield-lock"></i>
          </div>
          
          <h6 className={styles.modalSubtitle}>
            Asistencia Técnica Requerida
          </h6>
          
          <p className={styles.modalText}>
            Por seguridad, el restablecimiento de contraseñas requiere 
            autorización del área técnica.
          </p>
          
          <div className={styles.instructions}>
            <small className={styles.instructionsText}>
              Por favor, proporcione su nombre completo y número de identificación 
              estudiantil cuando se contacte con el área técnica.
            </small>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            type="button" 
            className={styles.confirmButton}
            onClick={onClose}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;