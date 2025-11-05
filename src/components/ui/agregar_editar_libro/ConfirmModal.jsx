import React from 'react';
import styles from "../../../styles/librosForm.module.css";
import global from "../../../styles/Global.module.css";

const ConfirmModal = React.memo(({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
  children
}) => {
  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button 
            className={styles.modalCloseBtn}
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalText}>{message}</p>
          {children}
        </div>
        <div className={styles.modalFooter}>
          <div className="d-flex justify-content-end gap-2 w-100">
            <button
              className={`${global.btnSecondary} w-25`}
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`${type === "warning" ? global.btnWarning : global.btnPrimary} w-25`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export default ConfirmModal;