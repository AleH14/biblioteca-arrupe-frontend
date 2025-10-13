"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/NotificacionesCorreo.module.css";
import global from "../../styles/Global.module.css";
import { FiHome, FiArrowLeft, FiSend, FiEye, FiCheckCircle } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

export default function NotificacionesCorreo({ volverPrestamos, prestamo }) {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const [correosEnviados, setCorreosEnviados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);

  // Inicializar datos basados en el préstamo seleccionado
  useEffect(() => {
    if (prestamo) {
      // Establecer valores por defecto basados en el préstamo 
      setAsunto(`Recordatorio de devolución - ${prestamo.libro}`);
      setDestinatario("");
      
      // Cargar notificaciones existentes del préstamo
      if (prestamo.notificaciones && prestamo.notificaciones.length > 0) {
        const notificacionesConvertidas = prestamo.notificaciones.map((notif, index) => ({
          id: notif._id || `notif-${index}`,
          asunto: notif.asunto,
          destinatario: notif.destinatario || "correo@ejemplo.com",
          fecha: new Date(notif.fechaEnvio).toLocaleString('es-ES'),
          mensaje: notif.mensaje,
          estado: "Enviado"
        }));
        setCorreosEnviados(notificacionesConvertidas);
      }
    }
  }, [prestamo]);

  const handleEnviarCorreo = (e) => {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim() || !destinatario.trim()) {
      alert("Por favor complete todos los campos");
      return;
    }

    const nuevoCorreo = {
      id: `correo-${Date.now()}`,
      asunto,
      destinatario,
      fecha: new Date().toLocaleString('es-ES'),
      mensaje,
      estado: "Enviado"
    };

    setCorreosEnviados([nuevoCorreo, ...correosEnviados]);
    setMensaje("");
    setDestinatario("");
    
    // Mostrar toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const verCorreo = (correo) => {
    setCorreoSeleccionado(correo);
    setMostrarModal(true);
  };

  // Información del préstamo actual
  const infoPrestamo = prestamo ? {
    usuario: prestamo.usuario,
    libro: prestamo.libro,
    fechaPrestamo: new Date(prestamo.fechaPrestamo).toLocaleDateString('es-ES'),
    fechaDevolucion: prestamo.fechaDevolucionEstimada ? 
      new Date(prestamo.fechaDevolucionEstimada).toLocaleDateString('es-ES') : 'No definida',
    estado: prestamo.estado
  } : null;

  return (
    <div className={global.backgroundWrapper}>
      {/* Header */}
      <header
        className={`${global.header} d-flex justify-content-between align-items-center`}
      >
        {/* Botón Volver - Solo ícono en móvil, ícono + texto en desktop */}
        <button className={styles.volverBtn} onClick={volverPrestamos}>
          <FiArrowLeft className={styles.volverIcon} />
          <span className={`${styles.volverTexto} d-none d-md-inline`}>Volver a Préstamos</span>
        </button>
        
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </header>

      {/* Título */}
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={`${global.complementoImg} me-2 ${styles.responsiveImg}`}
              />
              <h1 className={`${global.title} mb-0 ${styles.responsiveTitle}`}>
                Notificaciones por Correo
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Préstamo */}
      {infoPrestamo && (
        <div className="container mb-4">
          <div className={styles.prestamoInfo}>
            <h4 className={styles.prestamoTitle}>Información del Préstamo</h4>
            <div className="row">
              <div className="col-md-6">
                <div className={styles.infoItem}>
                  <strong>Usuario:</strong> {infoPrestamo.usuario}
                </div>
                <div className={styles.infoItem}>
                  <strong>Libro:</strong> {infoPrestamo.libro}
                </div>
              </div>
              <div className="col-md-6">
                <div className={styles.infoItem}>
                  <strong>Fecha Préstamo:</strong> {infoPrestamo.fechaPrestamo}
                </div>
                <div className={styles.infoItem}>
                  <strong>Devolución Estimada:</strong> {infoPrestamo.fechaDevolucion}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          {/* Formulario de Envío */}
          <div className="col-lg-6 mb-4">
            <div className={styles.emailForm}>
              <h3 className={styles.sectionTitle}>Enviar Correo</h3>
              <form onSubmit={handleEnviarCorreo}>
                <div className="mb-3">
                  <label className={styles.formLabel}>Destinatario</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    value={destinatario}
                    onChange={(e) => setDestinatario(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className={styles.formLabel}>Asunto</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    placeholder="Asunto del correo"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className={styles.formLabel}>Mensaje</label>
                  <textarea
                    className={styles.formTextarea}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escriba su mensaje aquí..."
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className={`${global.btnPrimary} ${styles.sendButton}`}>
                  <FiSend className="me-2" />
                  Enviar Correo
                </button>
              </form>
            </div>
          </div>

          {/* Historial de Correos */}
          <div className="col-lg-6">
            <div className={styles.historySection}>
              <h3 className={styles.sectionTitle}>Historial de Notificaciones</h3>
              
              {correosEnviados.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No hay notificaciones enviadas para este préstamo</p>
                </div>
              ) : (
                <div className={styles.correosList}>
                  {correosEnviados.map((correo) => (
                    <div key={correo.id} className={styles.correoItem}>
                      <div className={styles.correoHeader}>
                        <div className={styles.correoInfo}>
                          <strong className={styles.correoAsunto}>{correo.asunto}</strong>
                          <span className={styles.correoDestinatario}>{correo.destinatario}</span>
                          <span className={styles.correoFecha}>{correo.fecha}</span>
                        </div>
                        <div className={styles.correoActions}>
                          <button 
                            className={styles.actionBtn}
                            onClick={() => verCorreo(correo)}
                            title="Ver notificación"
                          >
                            <FiEye />
                          </button>
                        </div>
                      </div>
                      <div className={styles.correoPreview}>
                        {correo.mensaje.substring(0, 100)}...
                      </div>
                      <div className={styles.correoStatus}>
                        <span className={styles.estadoEnviado}>{correo.estado}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast de éxito */}
      {showToast && (
        <div className={styles.toastSuccess}>
          <FiCheckCircle className={styles.toastIcon} />
          <span>Notificación enviada correctamente</span>
        </div>
      )}

      {/* Modal para ver correo completo */}
      {mostrarModal && correoSeleccionado && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className={`modal-title ${styles.modalTitulo}`}>{correoSeleccionado.asunto}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className={styles.correoDetalle}>
                  <div className={styles.detalleItem}>
                    <strong>Destinatario:</strong> {correoSeleccionado.destinatario}
                  </div>
                  <div className={styles.detalleItem}>
                    <strong>Fecha:</strong> {correoSeleccionado.fecha}
                  </div>
                  <div className={styles.detalleItem}>
                    <strong>Estado:</strong> 
                    <span className={styles.estadoEnviado}> {correoSeleccionado.estado}</span>
                  </div>
                  <div className={styles.detalleMensaje}>
                    <strong>Mensaje:</strong>
                    <div className={styles.mensajeContenido}>
                      {correoSeleccionado.mensaje}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setMostrarModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}