import React from "react";
import styles from "../../../styles/estadisticas.module.css";
import { FiX } from "react-icons/fi";

export default function ModalCategoria({
  categoriaSeleccionada,
  setCategoriaSeleccionada,
  getLibrosPorCategoria,
  datosCategorias
}) {
  if (!categoriaSeleccionada) return null;

  const libros = getLibrosPorCategoria(categoriaSeleccionada.categoriaId);
  
  // Buscar estadísticas adicionales de esta categoría
  const ejemplaresPorCategoria = datosCategorias?.totalEjemplaresPorCategoria?.find(
    cat => String(cat.categoriaId) === String(categoriaSeleccionada.categoriaId)
  );
  
  const prestamosPorCategoria = datosCategorias?.totalPrestamosPorCategoria?.find(
    cat => String(cat.categoriaId) === String(categoriaSeleccionada.categoriaId)
  );
  
  const porcentajeCategoria = datosCategorias?.porcentajeCategorias?.find(
    cat => String(cat.categoriaId) === String(categoriaSeleccionada.categoriaId)
  );

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
        <div className={styles.modalBody}>
          <div className={styles.modalStats}>
            <span>Total de libros: {porcentajeCategoria?.totalLibros || 0}</span>
            <span>Ejemplares: {ejemplaresPorCategoria?.totalEjemplares || 0}</span>
            <span>Préstamos totales: {prestamosPorCategoria?.totalPrestamos || 0}</span>
          </div>
          <div className={styles.modalList}>
            {libros.map((libro, index) => {
              const ejemplares = libro.ejemplares ?? [];
              const disponibles = ejemplares.filter(e => e.estado === "disponible").length;
              
              // Calcular precio promedio
              const preciosEjemplares = ejemplares
                .filter(e => e.precio && e.precio > 0)
                .map(e => e.precio);
              const precioPromedio = preciosEjemplares.length > 0
                ? preciosEjemplares.reduce((a, b) => a + b, 0) / preciosEjemplares.length
                : 0;

              return (
                <div key={libro._id || index} className={styles.modalListItem}>
                  <div className={styles.modalBookInfo}>
                    <h5>{libro.titulo}</h5>
                    <p>{libro.autor}</p>
                    <small>
                      Ejemplares: {ejemplares.length} | 
                      Precio: ${precioPromedio.toFixed(2)}
                    </small>
                  </div>
                  <div className={styles.modalBookStats}>
                    <span>{disponibles} disponibles</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}