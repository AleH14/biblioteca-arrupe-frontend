import React from "react";
import styles from "../../../styles/IntEstudiantes.module.css";

const ActivityItemsEstudiante = React.memo(({ prestamos, reservas }) => {
  
  // 🟢 FUNCIÓN PARA DETERMINAR SI UN PRÉSTAMO ESTÁ RETRASADO
  const determinarEstadoConRetraso = (prestamo) => {
    // Si ya está cerrado, mantener cerrado
    if (prestamo.estado === "cerrado") return "cerrado";
    
    // Si el backend ya lo marcó como retrasado, mantenerlo
    if (prestamo.estado === "retrasado" || prestamo.estado === "atrasado") {
      return "retrasado";
    }
    
    // Si está activo, verificar si está retrasado comparando fechas
    if (prestamo.estado === "activo") {
      const fechaActual = new Date();
      const fechaEstimada = new Date(prestamo.fechaDevolucionEstimada);
      
      // Comparar fechas (sin horas para mayor precisión)
      fechaActual.setHours(0, 0, 0, 0);
      fechaEstimada.setHours(0, 0, 0, 0);
      
      if (fechaActual > fechaEstimada) {
        return "retrasado";
      }
    }
    
    // Si no aplica ninguna condición, devolver el estado original
    return prestamo.estado;
  };

  // 🟢 PROCESAR PRÉSTAMOS CON EL ESTADO REAL (EXCLUYENDO RESERVAS)
  const soloPrestamos = prestamos.filter(p => p.estado !== "reserva" && p.estado !== "reservado");
  
  const prestamosConEstadoReal = soloPrestamos.map(p => ({
    ...p,
    estadoCalculado: determinarEstadoConRetraso(p)
  }));

  // Filtrar por estado
  const prestamosActivos = prestamosConEstadoReal.filter((p) => 
    p.estadoCalculado !== "cerrado"
  );
  
  const prestamosCerrados = prestamosConEstadoReal.filter((p) => 
    p.estadoCalculado === "cerrado"
  );
  
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
            {todosPrestamos.map((item) => {
              // Determinar el texto a mostrar según el estado
              let textoEstado = "Activo";
              if (item.estadoCalculado === "cerrado") {
                textoEstado = "Cerrado";
              } else if (item.estadoCalculado === "retrasado") {
                textoEstado = "Entrega Atrasada";
              }
              
              return (
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
                        item.estadoCalculado === "cerrado"
                          ? styles.statusClosed
                          : item.estadoCalculado === "retrasado"
                          ? styles.statusLate
                          : styles.statusActive
                      }
                    >
                      {textoEstado}
                    </span>
                  </div>
                </div>
              );
            })}
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