"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import styles from "../../styles/NotificacionesCorreo.module.css";
import global from "../../styles/Global.module.css";

// Componentes existentes reutilizables
import PageTitle from "../ui/PageTitle";
import Toast from "../ui/Toast";

// Nuevos componentes
import AppHeaderNotificaciones from "../ui/notificaciones_prestamo/AppHeaderNotificaciones";
import NotificacionPrestamoInfo from "../ui/notificaciones_prestamo/NotificacionPrestamoInfo";
import NotificacionesHistorial from "../ui/notificaciones_prestamo/NotificacionesHistorial";
import EnviarCorreo from "../ui/notificaciones_prestamo/EnviarCorreo";
import NotificacionesModal from "../ui/notificaciones_prestamo/NotificacionesModal";

export default function NotificacionesCorreo({ volverPrestamos, prestamo }) {
  const { logout } = useAuth(); 
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [correosEnviados, setCorreosEnviados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);

  //  Función de logout
  const handleLogout = React.useCallback(async () => {
    try {
      await logout(); // Limpia token JWT y estado de autenticación
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  }, [logout]);

  // Cargar notificaciones existentes del préstamo
  useEffect(() => {
    if (prestamo?.notificaciones && prestamo.notificaciones.length > 0) {
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
  }, [prestamo]);

  const handleEnviarCorreo = React.useCallback((nuevoCorreo) => {
    setCorreosEnviados(prev => [nuevoCorreo, ...prev]);
    setToastMessage("Notificación enviada correctamente");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  const handleVerCorreo = React.useCallback((correo) => {
    setCorreoSeleccionado(correo);
    setMostrarModal(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setMostrarModal(false);
    setCorreoSeleccionado(null);
  }, []);

  return (
    <div className={global.backgroundWrapper}>
      <Toast show={showToast} message={toastMessage} />

      {/* AppHeaderNotificaciones con onLogoutClick */}
      <AppHeaderNotificaciones 
        onVolverClick={volverPrestamos} 
        onLogoutClick={handleLogout} 
      />

      <PageTitle title="Notificaciones por Correo" />

      {prestamo && (
        <div className="container mb-4">
          <NotificacionPrestamoInfo prestamo={prestamo} />
        </div>
      )}

      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 mb-4">
            <EnviarCorreo
              prestamo={prestamo}
              onEnviarCorreo={handleEnviarCorreo}
            />
          </div>

          <div className="col-lg-6">
            <NotificacionesHistorial 
              correosEnviados={correosEnviados}
              onVerCorreo={handleVerCorreo}
            />
          </div>
        </div>
      </div>

      {/* Modal como componente independiente */}
      {mostrarModal && (
        <NotificacionesModal 
          correoSeleccionado={correoSeleccionado}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}