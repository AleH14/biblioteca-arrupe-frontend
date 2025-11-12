import React from "react";
import styles from "../../styles/estadisticas.module.css";
import { FiTrendingUp } from "react-icons/fi";

export default function ResumenBiblioteca({
  datosEstadisticas,
  setMostrarDevolucionesAtrasadas,
  setMostrarLibrosReservados,
  costoTotalLibros,
  totalEjemplares,
}) {
  return (
    <div className={styles.statsCard}>
      <div className={styles.statsHeader}>
        <h3>Resumen de Biblioteca</h3>
        <FiTrendingUp className={styles.statsIcon} />
      </div>
      <div className={styles.statsGrid}>
        {/* Devoluciones atrasadas */}
        <div
          className={styles.statItem}
          onClick={() => setMostrarDevolucionesAtrasadas(true)}
        >
          <span className={styles.statLabel}>Devoluciones Atrasadas</span>
          <span className={styles.statValue}>
            {datosEstadisticas.devolucionesAtrasadas.length}
          </span>
          <div className={styles.detailText}>
            <small>Ver detalles</small>
          </div>
        </div>

        {/* Libros reservados */}
        <div
          className={styles.statItem}
          onClick={() => setMostrarLibrosReservados(true)}
        >
          <span className={styles.statLabel}>Libros Reservados</span>
          <span className={styles.statValue}>
            {datosEstadisticas.librosReservados.length}
          </span>
          <div className={styles.detailText}>
            <small>Ver detalles</small>
          </div>
        </div>

        {/* Costo total */}
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Costo Total Biblioteca</span>
          <span className={styles.statValue}>
            ${costoTotalLibros.toLocaleString()}
          </span>
        </div>

        {/* Ejemplares */}
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Ejemplares Totales</span>
          <span className={styles.statValue}>{totalEjemplares}</span>
        </div>
      </div>
    </div>
  );
}
