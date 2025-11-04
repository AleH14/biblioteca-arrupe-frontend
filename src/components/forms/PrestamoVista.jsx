"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/PrestamoVista.module.css";
import global from "../../styles/Global.module.css";
import NotificacionesCorreo from "./NotificacionesCorreo";

// Importar componentes UI
import Toast from "../ui/Toast";
import AppHeader from "../ui/AppHeader";
import PageTitle from "../ui/PageTitle";
import FilterPanel from "../ui/prestamos/FilterPanel";
import SearchSection from "../ui/prestamos/SearchSection";
import PrestamoCard from "../ui/prestamos/PrestamoCard";
import NuevoPrestamoModal from "../ui/prestamos/NuevoPrestamoModal";
import RenovarPrestamoModal from "../ui/prestamos/RenovarPrestamoModal";
import ConfirmarDevolucionModal from "../ui/prestamos/ConfirmarDevolucionModal";
import DetallesPrestamoModal from "../ui/prestamos/DetallesPrestamoModal";

export default function PrestamoVista({ volverMenu }) {
  const { logout } = useAuth();

  // Datos de ejemplo
  const prestamos = useMemo(
    () => [
      {
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
          },
        ],
        usuarioId: "64fae76d2f8f5c3a3c1b0001",
        usuario: "Maria Elizabeth Gonzalez Hernández",
        libro: "Cien Años de Soledad",
      },
      {
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
      },
      {
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
      },
      {
        _id: "5a934e000102030405000003",
        ejemplarId: "64fae76d2f8f5c3a3c1b5681",
        estado: "cerrado",
        fechaDevolucionEstimada: "2025-09-10",
        fechaDevolucionReal: "2025-09-08",
        fechaPrestamo: "2025-08-10",
        notificaciones: [],
        usuarioId: "64fae76d2f8f5c3a3c1b0004",
        usuario: "Pedro Lopez",
        libro: "La Sombra del Viento",
      },
    ],
    []
  );

  // Estados principales
  const [showModal, setShowModal] = useState(false);
  const [showModalDevolver, setShowModalDevolver] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [showModalRenovar, setShowModalRenovar] = useState(false);
  const [ejemplaresSeleccionados, setEjemplaresSeleccionados] = useState([""]);
  const [filtro, setFiltro] = useState("Todos");
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date());
  const [fechaDevolucion, setFechaDevolucion] = useState(null);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [nuevaFechaDevolucion, setNuevaFechaDevolucion] = useState(null);
  const [errorRenovacion, setErrorRenovacion] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [formData, setFormData] = useState({
    usuarioId: "",
    correo: "",
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // FUNCIÓN DE LOGOUT 
  const handleLogout = useCallback(async () => {
    try {
      await logout(); // Esta función debería limpiar el token JWT y redirigir al login
    } catch (error) {
      console.error("Error durante logout:", error);
    }
  }, [logout]);

  // Función memoizada para generar informe
  const handleGenerateReport = useCallback(() => {
    // Lógica para generar informe
  }, []);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setShowModalDevolver(false);
    setShowModalDetalles(false);
    setShowModalRenovar(false);
    setErrores({});
    setFormData({ usuarioId: "", correo: "" });
    setEjemplaresSeleccionados([""]);
    setFechaPrestamo(new Date());
    setFechaDevolucion(null);
    setPrestamoSeleccionado(null);
    setNuevaFechaDevolucion(null);
    setErrorRenovacion("");
  }, []);

  const handleBusqueda = useCallback((value) => {
    setSearchValue(value);
  }, []);

  const handleShow = useCallback(() => setShowModal(true), []);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errores[name]) {
        setErrores((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errores]
  );

  const handleEjemplarChange = useCallback(
    (index, value) => {
      const newEjemplares = [...ejemplaresSeleccionados];
      newEjemplares[index] = value;
      setEjemplaresSeleccionados(newEjemplares);
      if (errores.ejemplares) {
        setErrores((prev) => ({
          ...prev,
          ejemplares: "",
        }));
      }
    },
    [ejemplaresSeleccionados, errores.ejemplares]
  );

  const addEjemplar = useCallback(
    () => setEjemplaresSeleccionados((prev) => [...prev, ""]),
    []
  );

  const removeEjemplar = useCallback(
    (index) =>
      setEjemplaresSeleccionados((prev) => prev.filter((_, i) => i !== index)),
    []
  );

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};
    if (!formData.tipoUsuario) {
      nuevosErrores.tipoUsuario = "Seleccione el tipo de usuario";
    }

    if (!formData.usuarioId.trim()) {
      nuevosErrores.usuarioId = "El nombre del usuario es requerido";
    }

    const ejemplaresVacios = ejemplaresSeleccionados.some((ej) => !ej.trim());
    if (ejemplaresVacios) {
      nuevosErrores.ejemplares = "Ingresar ejemplar";
    }

    if (!fechaPrestamo) {
      nuevosErrores.fechaPrestamo = "La fecha de préstamo es requerida";
    }

    if (!fechaDevolucion) {
      nuevosErrores.fechaDevolucion =
        "La fecha de devolución estimada es requerida";
    } else if (fechaPrestamo) {
      const fechaPrestamoStr = fechaPrestamo.toISOString().split("T")[0];
      const fechaDevolucionStr = fechaDevolucion.toISOString().split("T")[0];
      if (fechaDevolucionStr < fechaPrestamoStr) {
        nuevosErrores.fechaDevolucion =
          "La fecha de devolución debe ser mayor o igual a la fecha de préstamo";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [
    formData.tipoUsuario,
    formData.usuarioId,
    ejemplaresSeleccionados,
    fechaPrestamo,
    fechaDevolucion,
  ]);

  const handleGuardarPrestamo = useCallback(() => {
    if (!validarFormulario()) return;

    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      handleClose();
      setToastMessage(
        `Préstamo de ${formData.usuarioId} agregado correctamente`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  }, [validarFormulario, formData.usuarioId, handleClose]);

  const handleDevolverPrestamo = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalDevolver(true);
  }, []);

  const confirmarDevolucion = useCallback(() => {
    setTimeout(() => {
      handleClose();
      setToastMessage(
        `Libro "${prestamoSeleccionado?.libro}" devuelto correctamente`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 500);
  }, [prestamoSeleccionado, handleClose]);

  const handleRenovarPrestamoLista = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setNuevaFechaDevolucion(null);
    setErrorRenovacion("");
    setShowModalRenovar(true);
  }, []);

  const handleFechaRenovacionChange = useCallback(
    (date) => {
      setNuevaFechaDevolucion(date);
      if (errorRenovacion) setErrorRenovacion("");
    },
    [errorRenovacion]
  );

  const handleRenovarPrestamo = useCallback(() => {
    if (!nuevaFechaDevolucion) {
      setErrorRenovacion("Debe seleccionar una nueva fecha de devolución");
      return;
    }
    setErrorRenovacion("");
    setTimeout(() => {
      handleClose();
      setToastMessage(
        `Préstamo de "${prestamoSeleccionado?.libro}" renovado hasta ${
          nuevaFechaDevolucion.toISOString().split("T")[0]
        }`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 500);
  }, [nuevaFechaDevolucion, prestamoSeleccionado, handleClose]);

  const verDetalles = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalDetalles(true);
  }, []);

  const abrirNotificaciones = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setMostrarNotificaciones(true);
  }, []);

  const volverPrestamos = useCallback(() => {
    setMostrarNotificaciones(false);
    setPrestamoSeleccionado(null);
    setSearchValue("");
  }, []);

  const formatearFecha = useCallback((fechaString) => {
    if (!fechaString) return "No definida";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES");
  }, []);

  const obtenerEstadoVisual = useCallback((prestamo) => {
    switch (prestamo.estado) {
      case "activo":
        return "Activo";
      case "retrasado":
        return "Entrega Retrasada";
      case "cerrado":
        return "Devuelto";
      default:
        return prestamo.estado;
    }
  }, []);

  const obtenerClaseEstado = useCallback(
    (prestamo) => {
      switch (prestamo.estado) {
        case "activo":
          return styles.estadoActivo;
        case "retrasado":
          return styles.estadoRetrasado;
        case "cerrado":
          return styles.estadoCerrado;
        default:
          return styles.estadoActivo;
      }
    },
    [styles]
  );

  const prestamosFiltrados = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return prestamos.filter((p) => {
      const cumpleFiltroTexto =
        !searchValue ||
        p.usuario.toLowerCase().includes(searchLower) ||
        p.libro.toLowerCase().includes(searchLower);
      const cumpleFiltroEstado =
        filtro === "Todos" ||
        (filtro === "Activos" && p.estado === "activo") ||
        (filtro === "Atrasados" && p.estado === "retrasado") ||
        (filtro === "Devueltos" && p.estado === "cerrado");
      return cumpleFiltroTexto && cumpleFiltroEstado;
    });
  }, [prestamos, filtro, searchValue]);

  if (mostrarNotificaciones) {
    return (
      <NotificacionesCorreo
        volverPrestamos={volverPrestamos}
        prestamo={prestamoSeleccionado}
      />
    );
  }

  return (
    <div className={global.backgroundWrapper}>
      <Toast show={showToast} message={toastMessage} />

      {/*HEADER CON LOGOUT */}
      <AppHeader onHomeClick={volverMenu} onLogoutClick={handleLogout} />

      <PageTitle title="Préstamos" />

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-3 col-lg-2 mb-4">
            <FilterPanel
              filtro={filtro}
              onFiltroChange={setFiltro}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          <div className="col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              <SearchSection
                onSearchChange={handleBusqueda}
                onNewItem={handleShow}
              />

              <div className={styles.loansListContainer}>
                <div className={styles.loansList}>
                  {prestamosFiltrados.map((p) => (
                    <PrestamoCard
                      key={p._id}
                      prestamo={p}
                      onRenovar={handleRenovarPrestamoLista}
                      onDevolver={handleDevolverPrestamo}
                      onVerDetalles={verDetalles}
                      onNotificaciones={abrirNotificaciones}
                      formatearFecha={formatearFecha}
                      obtenerEstadoVisual={obtenerEstadoVisual}
                      obtenerClaseEstado={obtenerClaseEstado}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NuevoPrestamoModal
        show={showModal}
        onClose={handleClose}
        formData={formData}
        onInputChange={handleInputChange}
        errores={errores}
        ejemplaresSeleccionados={ejemplaresSeleccionados}
        onEjemplarChange={handleEjemplarChange}
        onAddEjemplar={addEjemplar}
        onRemoveEjemplar={removeEjemplar}
        fechaPrestamo={fechaPrestamo}
        onFechaPrestamoChange={setFechaPrestamo}
        fechaDevolucion={fechaDevolucion}
        onFechaDevolucionChange={setFechaDevolucion}
        onGuardar={handleGuardarPrestamo}
        guardando={guardando}
      />

      <RenovarPrestamoModal
        show={showModalRenovar}
        onClose={handleClose}
        prestamo={prestamoSeleccionado}
        nuevaFechaDevolucion={nuevaFechaDevolucion}
        onFechaChange={handleFechaRenovacionChange}
        errorRenovacion={errorRenovacion}
        onRenovar={handleRenovarPrestamo}
        formatearFecha={formatearFecha}
      />

      <ConfirmarDevolucionModal
        show={showModalDevolver}
        onClose={handleClose}
        prestamo={prestamoSeleccionado}
        onConfirmar={confirmarDevolucion}
        formatearFecha={formatearFecha}
      />

      <DetallesPrestamoModal
        show={showModalDetalles}
        onClose={handleClose}
        prestamo={prestamoSeleccionado}
        formatearFecha={formatearFecha}
        obtenerEstadoVisual={obtenerEstadoVisual}
        obtenerClaseEstado={obtenerClaseEstado}
      />
    </div>
  );
}
