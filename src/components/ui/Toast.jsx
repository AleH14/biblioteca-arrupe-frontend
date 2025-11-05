import React from 'react';
import styles from '../../styles/PrestamoVista.module.css';

const Toast = React.memo(({ show, message, type = 'success' }) => {
  if (!show) return null;
  
  return (
    <div className={styles.toastSuccess}>
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>✓</span>
        <span>{message}</span>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;