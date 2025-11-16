import React from "react";
import styles from "../../../styles/estadisticas.module.css";

export default function BarChart({ filtroGlobal, tendenciaActual, metricasActuales }) {
  const maxPrestamos = Math.max(...tendenciaActual.map(i => i.prestamos));
  const minHeight = 30, maxHeight = 300;

  const calcAltura = (p) => {
    if (maxPrestamos === 0) return minHeight;
    const prop = p / maxPrestamos;
    return minHeight + prop * (maxHeight - minHeight);
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>
          {filtroGlobal === "hoy"
            ? "Préstamos por Hora - Hoy"
            : filtroGlobal === "mensual"
            ? "Préstamos por Semana - Este Mes"
            : "Préstamos por Mes - Este Año"}
        </h3>
        <span className={styles.chartPeriod}>Total: {metricasActuales.prestamosTotales} préstamos</span>
      </div>
      <div className={styles.chartContainer}>
        <div className={styles.barChart}>
          {tendenciaActual.map((item, i) => (
            <div key={i} className={styles.barContainer}>
              <div className={styles.bar} style={{ height: `${calcAltura(item.prestamos)}px` }}>
                <span className={styles.barValue}>{item.prestamos}</span>
              </div>
              <span className={styles.barLabel}>{item.periodo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
