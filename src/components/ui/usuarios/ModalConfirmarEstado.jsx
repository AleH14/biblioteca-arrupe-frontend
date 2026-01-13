"use client";
import React from "react";
import styles from "../../../styles/Usuarios.module.css";
import global from "../../../styles/Global.module.css";

const ModalConfirmarEstado = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  usuario, 
  mensaje, // Mensaje dinámico opcional
  actionLabel // Texto del botón, "Deshabilitar" o "Habilitar"
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.deleteTitle}>
            {actionLabel?.toUpperCase() || "CONFIRMAR ACCIÓN"} USUARIO
          </h3>
          <button className={styles.closeButton} onClick={onClose}>✖</button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.deleteText}>
            {mensaje || `¿Seguro que deseas ${actionLabel?.toLowerCase() || "realizar esta acción"} a `}
            <b>{usuario?.nombre}</b>?
          </p>
          {actionLabel?.toLowerCase() === "deshabilitar" && (
            <p className={styles.deleteWarning}>
              El usuario no podrá acceder al sistema mientras esté deshabilitado.
            </p>
          )}
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
              {actionLabel || "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEstado;
