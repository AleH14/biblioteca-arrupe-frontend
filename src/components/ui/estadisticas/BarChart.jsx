import React from "react";
import styles from "../../../styles/estadisticas.module.css";

export default function BarChart({
  filtroGlobal,
  tendenciaActual = [],
  metricasActuales
}) {

  const maxPrestamos = Math.max(
    ...tendenciaActual.map(item => item.prestamosTotales || 0),
    1
  );

  const minHeight = 30;
  const maxHeight = 300;

  const calcAltura = (prestamos) => {
    if (prestamos === 0) return minHeight;
    const prop = prestamos / maxPrestamos;
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
        <span className={styles.chartPeriod}>
          Total: {metricasActuales?.prestamosTotales || 0} préstamos
        </span>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.barChart}>
          {tendenciaActual.length === 0 ? (
            <div className={styles.noData}>
              No hay datos de tendencias disponibles
            </div>
          ) : (
            tendenciaActual.map((item, i) => (
              <div key={`${item.periodo}-${i}`} className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ 
                    height: `${calcAltura(item.prestamosTotales || 0)}px` 
                  }}
                >
                  <span className={styles.barValue}>
                    {item.prestamosTotales || 0}
                  </span>
                </div>
                <span className={styles.barLabel}>{item.periodo || `P${i+1}`}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
