// src/components/ui/estadisticas/ModalCategoria.jsx
import React from "react";
import styles from "../../../styles/estadisticas.module.css";
import { FiX } from "react-icons/fi";

export default function ModalCategoria({
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  getLibrosPorCategoria,
}) {
  if (!categoriaSeleccionada) return null;

  const libros = getLibrosPorCategoria(
    categoriaSeleccionada.categoriaId
  ) || [];

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Libros de: {categoriaSeleccionada.categoria}</h3>

          <button
            className={styles.modalClose}
            onClick={() => setCategoriaSeleccionada(null)}
          >
            <FiX />
          </button>
        </div>

        <div className={styles.modalList}>
          {libros.length === 0 && (
            <p style={{ color: "#6b7280" }}>
              No hay libros en esta categoría
            </p>
          )}

          {libros.map((libro, index) => {
            const ejemplares = libro.ejemplares ?? [];

            const disponibles = ejemplares.filter(
              (e) => e.estado === "disponible"
            ).length;

            const estaDisponible = disponibles > 0;

            return (
              <div
                key={libro._id || libro.libroId || index}
                className={styles.modalListItem}
              >
                <div className={styles.modalBookInfo}>
                  <h5>{libro.titulo}</h5>
                  <p>{libro.autor}</p>

                  <small>
                    Ejemplares: {ejemplares.length} | Disponibles: {disponibles}
                  </small>
                </div>

                <div className={styles.modalBookStats}>
                  <span
                    style={{
                      color: estaDisponible ? "#22c55e" : "#ef4444",
                      fontWeight: 600,
                    }}
                  >
                    {estaDisponible ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
