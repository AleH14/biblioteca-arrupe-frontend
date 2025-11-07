import React from "react";
import styles from "../../../styles/IntEstudiantes.module.css";

const ActivityItemsEstudiante = React.memo(({ prestamos, reservas }) => {
  // Filtrar por estado
  const prestamosActivos = prestamos.filter((p) =>
    ["activo", "retrasado"].includes(p.estado)
  );
  const prestamosCerrados = prestamos.filter((p) => p.estado === "cerrado");
  const reservasActivas = reservas.filter((p) => p.estado === "reservado");

  // Unir todos los préstamos (activos + cerrados)
  const todosPrestamos = [...prestamosActivos, ...prestamosCerrados];

  return (
    <div className={styles.activityContainer}>
      {/* 🟦 Reservas Activas */}
      <section className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Reservas Activas</h3>
        {reservasActivas.length > 0 ? (
          <div className={styles.historyList}>
            {reservasActivas.map((item) => (
              <div key={`reserva-${item._id}`} className={styles.historyItem}>
                <img
                  src={item.portada || "/images/librodefault.png"}
                  alt={item.libro}
                  width={80}
                  height={100}
                  className={styles.historyImage}
                />
                <div className={styles.historyContent}>
                  <h4>{item.libro}</h4>
                  <p className={styles.historyAuthor}>
                    Usuario: {item.usuario || "No especificado"}
                  </p>
                  <div className={styles.historyDates}>
                    <span>Reserva: {item.fechaReserva || "N/A"}</span>
                    <span>Vence: {item.fechaExpiracion || "N/A"}</span>
                  </div>
                </div>
                <div className={styles.historyStatus}>
                  <span className={styles.statusReserved}>Reservado</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${styles.noContentCompact}`}>
            <p>No hay reservas activas.</p>
          </div>
        )}
      </section>

      {/* 🟩 Historial de Préstamos */}
      <section className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Historial de Préstamos</h3>
        {todosPrestamos.length > 0 ? (
          <div className={styles.historyList}>
            {todosPrestamos.map((item) => (
              <div key={`prestamo-${item._id}`} className={styles.historyItem}>
                <img
                  src={item.portada || "/images/librodefault.png"}
                  alt={item.libro}
                  width={80}
                  height={100}
                  className={styles.historyImage}
                />
                <div className={styles.historyContent}>
                  <h4>{item.libro}</h4>
                  <p className={styles.historyAuthor}>
                    Usuario: {item.usuario || "No especificado"}
                  </p>
                  <div className={styles.historyDates}>
                    <span>Prestado: {item.fechaPrestamo || "N/A"}</span>
                    {item.fechaDevolucionReal ? (
                      <span>Devuelto: {item.fechaDevolucionReal}</span>
                    ) : (
                      <span>Estimada: {item.fechaDevolucionEstimada || "N/A"}</span>
                    )}
                  </div>
                </div>
                <div className={styles.historyStatus}>
                  <span
                    className={
                      item.estado === "cerrado"
                        ? styles.statusClosed
                        : item.estado === "retrasado"
                        ? styles.statusLate
                        : styles.statusActive
                    }
                  >
                    {item.estado === "cerrado"
                      ? "Cerrado"
                      : item.estado === "retrasado"
                      ? "Retrasado"
                      : "Activo"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${styles.noContentCompact}`}>
            <p>No hay préstamos registrados.</p>
          </div>
        )}
      </section>
    </div>
  );
});

export default ActivityItemsEstudiante;
