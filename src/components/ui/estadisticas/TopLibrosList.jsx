import React from "react";
import styles from "../../../styles/estadisticas.module.css";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function TopLibrosList({
  vistaLibros,
  setVistaLibros,
  librosMasPrestados,
  librosMenosPrestados,
}) {
  // Selecciona qué lista mostrar (igual que en el Estadisticas original)
  const librosActuales =
    vistaLibros === "masPrestados" ? librosMasPrestados : librosMenosPrestados;

  return (
    <div className={styles.listCard}>
      <div className={styles.listHeader}>
        <h3>
          {vistaLibros === "masPrestados"
            ? "Libros Más Prestados"
            : "Libros Menos Prestados"}
        </h3>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${
              vistaLibros === "masPrestados" ? styles.active : ""
            }`}
            onClick={() => setVistaLibros("masPrestados")}
          >
            <FiArrowUp /> Más
          </button>
          <button
            className={`${styles.toggleBtn} ${
              vistaLibros === "menosPrestados" ? styles.active : ""
            }`}
            onClick={() => setVistaLibros("menosPrestados")}
          >
            <FiArrowDown /> Menos
          </button>
        </div>
      </div>

      <div className={styles.listContent}>
        {librosActuales.map((libro, index) => (
          <div
               key={libro._id ?? libro.id ?? index}
              className={styles.listItem}
            >

            <div className={styles.itemRank}>
              <span className={styles.rankNumber}>{index + 1}</span>
            </div>
            <div className={styles.itemInfo}>
              <h5 className={styles.itemTitle}>{libro.titulo}</h5>
              <p className={styles.categoryItem}>{libro.autor}</p>
            </div>
            <div className={styles.itemValue}>
              <span>{libro.totalPrestamos}</span>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
