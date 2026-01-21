import React from 'react';
import { FiBell } from 'react-icons/fi';
import styles from '../../../styles/PrestamoVista.module.css';
import global from '../../../styles/Global.module.css';

const PrestamoCard = React.memo(({ 
  prestamo, 
  onRenovar, 
  onDevolver, 
  onVerDetalles, 
  onNotificaciones,
  onPrestarReserva,
  formatearFecha,
  obtenerEstadoVisual,
  obtenerClaseEstado 
}) => {
  return (
    <div className={styles.card}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
        <div className={styles.loanInfo}>
          <strong>{prestamo.usuario}</strong>
          <br />
          <small>{prestamo.libro}</small>
          <br />
          <small className={styles.fecha}>
            {prestamo.estado === "reserva" 
              ? "reserva - Pendiente de préstamo"
              : `Préstamo: ${formatearFecha(prestamo.fechaPrestamo)}`
            }
          </small>
        </div>
        <div className={styles.loanStatus}>
          <span className={obtenerClaseEstado(prestamo)}>
            {obtenerEstadoVisual(prestamo)}
          </span>
          <br />
           <small className={styles.fecha}>
            {prestamo.fechaDevolucionReal && prestamo.estado === "cerrado"
              ? `Devuelto: ${formatearFecha(prestamo.fechaDevolucionReal)}`
              : prestamo.estado === "reserva"
              ? "Fecha por definir"
              : prestamo.estado === "activo" || prestamo.estado === "atrasado"
              ? `Vence: ${formatearFecha(prestamo.fechaDevolucionEstimada)}`
              : "Fecha no disponible"}
          </small>
        </div>
        <div className="d-flex gap-2">
          {/* BOTÓN PRESTAR PARA reservaS */}
          {prestamo.estado === "reserva" && (
            <button
              className={global.btnWarning}
              onClick={() => onPrestarReserva(prestamo)}
            >
              Prestar
            </button>
          )}
          
          {/* BOTÓN RENOVAR PARA ACTIVOS Y ATRASADOS */}
          {(prestamo.estado === "activo" || prestamo.estado === "atrasado") && (
            <button
              className={global.btnWarning}
              onClick={() => onRenovar(prestamo)}
            >
              Renovar
            </button>
          )}
          
          {/* BOTÓN DEVOLVER/VER DETALLES - OCULTAR PARA reservaS */}
          {prestamo.estado !== "reserva" && (
            <button
              className={global.btnSecondary}
              onClick={() =>
                prestamo.estado === "cerrado"
                  ? onVerDetalles(prestamo)
                  : onDevolver(prestamo)
              }
            >
              {prestamo.estado === "cerrado" ? "Ver Detalles" : "Devolver"}
            </button>
          )}
          
          {/* Botón de Notificaciones - OCULTAR PARA reservaS */}
          {prestamo.estado !== "reserva" && (
            <button
              className={styles.notificationBtn}
              onClick={() => onNotificaciones(prestamo)}
              title="Enviar notificación"
            >
              <FiBell className={styles.notificationIcon} />
              {prestamo.notificaciones && prestamo.notificaciones.length > 0 && (
                <span className={styles.notificationNumber}>
                  {prestamo.notificaciones.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

PrestamoCard.displayName = 'PrestamoCard';

export default PrestamoCard;