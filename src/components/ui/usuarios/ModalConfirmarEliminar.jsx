"use client";
import React from "react";
import styles from "../../../styles/Usuarios.module.css";
import global from "../../../styles/Global.module.css";

const ModalConfirmarEliminar = ({ isOpen, onClose, onConfirm, usuario }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.deleteTitle}>ELIMINAR USUARIO</h3>
          <button className={styles.closeButton} onClick={onClose}>✖</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.deleteText}>
            ¿Seguro que deseas eliminar a <b>{usuario?.nombre}</b>?
          </p>
          <p className={styles.deleteWarning}>Esta acción no se puede deshacer.</p>
        </div>

       <div className={styles.modalFooter}>
  <div className="d-flex justify-content-end gap-2">

    <button
      className={`${global.btnSecondary} ${styles.equalButton}`}
      onClick={onClose}
    >
      Cancelar
    </button>

    <button
      className={`${global.btnPrimary} ${styles.equalButton}`}
      onClick={onConfirm}
    >
      Eliminar
    </button>

  </div>
</div>



      </div>
    </div>
  );
};

export default ModalConfirmarEliminar;
