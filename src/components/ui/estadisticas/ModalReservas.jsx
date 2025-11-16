import React from "react";
import styles from "../../../styles/estadisticas.module.css";
import { FiX } from "react-icons/fi";

export default function ModalReservas({ datos, setMostrarLibrosReservados }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Libros Reservados</h3>
          <button
            className={styles.modalClose}
            onClick={() => setMostrarLibrosReservados(false)}
          >
            <FiX />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalList}>
            {datos.map((r) => (
              <div key={r._id} className={styles.modalListItem}>
                <div className={styles.modalBookInfo}>
                  <h5>{r.estudiante}</h5>
                  <p>{r.libro}</p>
                  <small>
                    Grado: {r.grado} | Fecha: {r.fechaReserva}
                  </small>
                </div>
                <div className={styles.modalBookStats}>
                  <span className={styles.reservado}>Reservado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
