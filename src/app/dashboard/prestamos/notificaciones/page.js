"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import global from "@/styles/Global.module.css";

// Componentes existentes reutilizables
import Toast from "@/components/ui/Toast";
import PageTitle from "@/components/ui/PageTitle";
import AppHeaderNotificaciones from "@/components/ui/notificaciones_prestamo/AppHeaderNotificaciones";
import NotificacionPrestamoInfo from "@/components/ui/notificaciones_prestamo/NotificacionPrestamoInfo";
import NotificacionesHistorial from "@/components/ui/notificaciones_prestamo/NotificacionesHistorial";
import EnviarCorreo from "@/components/ui/notificaciones_prestamo/EnviarCorreo";
import NotificacionesModal from "@/components/ui/notificaciones_prestamo/NotificacionesModal";

// Datos simulados de préstamos según ID
const obtenerPrestamoSimulado = (id) => {
  const prestamosBase = {
    "5a934e000102030405000000": {
      _id: "5a934e000102030405000000",
      ejemplarId: "64fae76d2f8f5c3a3c1b5678",
      estado: "activo",
      fechaDevolucionEstimada: "2025-09-20",
      fechaDevolucionReal: null,
      fechaPrestamo: "2025-08-20",
      notificaciones: [
        {
          _id: "64fae76d2f8f5c3a3c1b9999",
          asunto: "Recordatorio devolución",
          fechaEnvio: "2025-09-15",
          mensaje: "Tu libro debe devolverse antes del 20/09",
          destinatario: "maria@ejemplo.com"
        },
      ],
      usuarioId: "64fae76d2f8f5c3a3c1b0001",
      usuario: "Maria Elizabeth Gonzalez Hernández",
      libro: "Cien Años de Soledad",
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      correo: "maria@ejemplo.com"
    },
    "5a934e000102030405000001": {
      _id: "5a934e000102030405000001",
      ejemplarId: "64fae76d2f8f5c3a3c1b5679",
      estado: "retrasado",
      fechaDevolucionEstimada: "2025-09-05",
      fechaDevolucionReal: null,
      fechaPrestamo: "2025-08-05",
      notificaciones: [],
      usuarioId: "64fae76d2f8f5c3a3c1b0002",
      usuario: "Carlos Rodriguez",
      libro: "El Quijote",
      portada: "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      correo: "carlos@ejemplo.com"
    },
    "5a934e000102030405000002": {
      _id: "5a934e000102030405000002",
      ejemplarId: "64fae76d2f8f5c3a3c1b5680",
      estado: "cerrado",
      fechaDevolucionEstimada: "2025-09-03",
      fechaDevolucionReal: "2025-09-02",
      fechaPrestamo: "2025-08-03",
      notificaciones: [],
      usuarioId: "64fae76d2f8f5c3a3c1b0003",
      usuario: "Ana Martinez",
      libro: "Rayuela",
      portada: "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      correo: "ana@ejemplo.com"
    },
    "5a934e000102030405000003": {
      _id: "5a934e000102030405000003",
      ejemplarId: "64fae76d2f8f5c3a3c1b5681",
      estado: "cerrado",
      fechaDevolucionEstimada: "2025-09-10",
      fechaDevolucionReal: "2025-09-08",
      fechaPrestamo: "2025-08-10",
      notificaciones: [],
      usuarioId: "64fae76d2f8f5c3a3c1b0004",
      usuario: "Pedro Lopez",
      libro: "El Principito",
      portada: "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      correo: "pedro@ejemplo.com"
    },
    "5a934e000102030405000004": {
      _id: "5a934e000102030405000004",
      ejemplarId: "64fae76d2f8f5c3a3c1b5682",
      estado: "reservado",
      fechaDevolucionEstimada: null,
      fechaDevolucionReal: null,
      fechaPrestamo: null,
      notificaciones: [],
      usuarioId: "64fae76d2f8f5c3a3c1b0005",
      usuario: "Laura García",
      libro: "1984",
      portada: "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      correo: "laura@ejemplo.com"
    }
  };
  
  return prestamosBase[id] || null;
};

export default function NotificacionesCorreoPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [correosEnviados, setCorreosEnviados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  // Obtener el préstamo según el ID en los parámetros de búsqueda
  useEffect(() => {
    const prestamoId = searchParams.get('id');
    
    if (prestamoId) {
      // Usamos datos simulados en lugar de llamadas a API
      const prestamo = obtenerPrestamoSimulado(prestamoId);
      if (prestamo) {
        setPrestamoSeleccionado(prestamo);
        
        // Cargar notificaciones existentes del préstamo (igual que en tu lógica original)
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
    }
  }, [searchParams]);

  const handleLogout = React.useCallback(async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      router.push('/login');
    }
  }, [logout, router]);

  const handleVolverAPrestamos = React.useCallback(() => {
    router.push('/dashboard/prestamos');
  }, [router]);

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

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className={global.backgroundWrapper}>
      <Toast show={showToast} message={toastMessage} />

      {/* AppHeaderNotificaciones con onLogoutClick */}
      <AppHeaderNotificaciones 
        onVolverClick={handleVolverAPrestamos} 
        onLogoutClick={handleLogout} 
      />

      <PageTitle title="Notificaciones por Correo" />

      {prestamoSeleccionado && (
        <div className="container mb-4">
          <NotificacionPrestamoInfo prestamo={prestamoSeleccionado} />
        </div>
      )}

      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 mb-4">
            <EnviarCorreo
              prestamo={prestamoSeleccionado}
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