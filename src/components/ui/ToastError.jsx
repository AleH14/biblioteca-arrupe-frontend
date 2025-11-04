// ui/ToastError.jsx
import React from 'react';
import styles from '../../styles/librosForm.module.css';

const ToastError = React.memo(({ show, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className={styles.notificacionError}>
      <div className={styles.errorIcon}>⚠</div>
      <span>{message}</span>
      <button
        className={styles.errorCloseBtn}
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
});

ToastError.displayName = 'ToastError';

export default ToastError;