import React from "react";
import styles from "../../styles/estadisticas.module.css";
import { FiBook, FiCalendar, FiUsers, FiAward } from "react-icons/fi";

export default function MetricCards({ metricasActuales }) {
  return (
    <div className="row g-4 mb-5">
      <div className="col-12 col-sm-6 col-lg-3">
        <div className={`${styles.metricCard} ${styles.red}`}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}><FiBook /></div>
            <div className={styles.metricInfo}>
              <h3 className={styles.metricValue}>{metricasActuales.prestamosTotales.toLocaleString()}</h3>
              <p className={styles.metricTitle}>Préstamos Totales</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <div className={`${styles.metricCard} ${styles.gold}`}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}><FiCalendar /></div>
            <div className={styles.metricInfo}>
              <h3 className={styles.metricValue}>{metricasActuales.prestamosActivos.toLocaleString()}</h3>
              <p className={styles.metricTitle}>Préstamos Activos</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <div className={`${styles.metricCard} ${styles.black}`}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}><FiUsers /></div>
            <div className={styles.metricInfo}>
              <h3 className={styles.metricValue}>{metricasActuales.usuariosRegistrados.toLocaleString()}</h3>
              <p className={styles.metricTitle}>Estudiantes Registrados</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-sm-6 col-lg-3">
        <div className={`${styles.metricCard} ${styles.gray}`}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}><FiAward /></div>
            <div className={styles.metricInfo}>
              <h3 className={styles.metricValue}>{metricasActuales.librosBiblioteca.toLocaleString()}</h3>
              <p className={styles.metricTitle}>Libros en Biblioteca</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
