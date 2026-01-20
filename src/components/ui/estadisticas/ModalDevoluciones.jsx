import React from "react";
import styles from "../../../styles/estadisticas.module.css";
import { FiX } from "react-icons/fi";

export default function ModalDevoluciones({ datos, setMostrarDevolucionesAtrasadas }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Devoluciones Atrasadas</h3>
          <button
            className={styles.modalClose}
            onClick={() => setMostrarDevolucionesAtrasadas(false)}
          >
            <FiX />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalList}>
            {datos.map((d) => (
              <div key={d._id} className={styles.modalListItem}>
                <div className={styles.modalBookInfo}>
                  <h5>{d.estudiante}</h5>
                  <p>{d.libro}</p>
                </div>
                <div className={styles.modalBookStats}>
                  <span className={styles.diasAtraso}>{d.diasAtraso}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
