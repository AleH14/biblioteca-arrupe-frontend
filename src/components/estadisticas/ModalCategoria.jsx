import React from "react";
import styles from "../../styles/estadisticas.module.css";
import { FiX } from "react-icons/fi";

export default function ModalCategoria({
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  getLibrosPorCategoria,
}) {
  const libros = getLibrosPorCategoria(categoriaSeleccionada._id);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Libros de: {categoriaSeleccionada.nombre}</h3>
          <button
            className={styles.modalClose}
            onClick={() => setCategoriaSeleccionada(null)}
          >
            <FiX />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalStats}>
            <span>Total de libros: {categoriaSeleccionada.cantidadLibros}</span>
            <span>Ejemplares: {categoriaSeleccionada.cantidadEjemplares}</span>
            <span>Préstamos totales: {categoriaSeleccionada.totalPrestamos}</span>
          </div>
          <div className={styles.modalList}>
            {libros.map((libro) => (
              <div key={libro._id} className={styles.modalListItem}>
                <div className={styles.modalBookInfo}>
                  <h5>{libro.titulo}</h5>
                  <p>{libro.autor}</p>
                  <small>
                    Ejemplares: {libro.ejemplares.length} | Precio: ${libro.precio}
                  </small>
                </div>
                <div className={styles.modalBookStats}>
                  <span>{libro.prestamos} préstamos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
