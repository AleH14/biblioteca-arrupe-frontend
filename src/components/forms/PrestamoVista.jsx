"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import styles from "../../styles/PrestamoVista.module.css";
import global from "../../styles/Global.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NotificacionesCorreo from "./NotificacionesCorreo";

// Importar componentes UI
import Toast from "../ui/Toast";
import AppHeader from "../ui/AppHeader";
import PageTitle from "../ui/PageTitle";
import FilterPanel from "../ui/FilterPanel";
import SearchSection from "../ui/SearchSection";
import PrestamoCard from "../ui/PrestamoCard";
import NuevoPrestamoModal from "../ui/NuevoPrestamoModal";
import RenovarPrestamoModal from "../ui/RenovarPrestamoModal";
import ConfirmarDevolucionModal from "../ui/ConfirmarDevolucionModal";
import DetallesPrestamoModal from "../ui/DetallesPrestamoModal";

export default function PrestamoVista({ volverMenu }) {
  console.count('🎯 PrestamoVista render'); // Para verificar renders del componente principal
  // Datos de ejemplo basados en la estructura del JSON
  const prestamos = [
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
  ];

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
  const [fechaRenovada, setFechaRenovada] = useState(false);
  const [errorRenovacion, setErrorRenovacion] = useState("");
  
  // 🎯 Usar useRef para el valor de búsqueda - no causa re-renders
  const searchRef = useRef("");

  const [formData, setFormData] = useState({
    usuarioId: "",
    correo: "",
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 🎯 Función memoizada para generar informe
  const handleGenerateReport = useCallback(() => {
    console.log("Generando informe...");
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
    setFechaRenovada(false);
    setErrorRenovacion(null);
  }, []);

  // Memoizar funciones para evitar recreaciones innecesarias
  const handleBusqueda = useCallback((value) => {
    searchRef.current = value;
  }, []);

  const handleShow = useCallback(() => setShowModal(true), []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [errores]);

  const handleEjemplarChange = useCallback((index, value) => {
    const newEjemplares = [...ejemplaresSeleccionados];
    newEjemplares[index] = value;
    setEjemplaresSeleccionados(newEjemplares);

    // Limpiar error de ejemplares si hay
    if (errores.ejemplares) {
      setErrores((prev) => ({
        ...prev,
        ejemplares: "",
      }));
    }
  }, [ejemplaresSeleccionados, errores.ejemplares]);

  const addEjemplar = useCallback(() =>
    setEjemplaresSeleccionados(prev => [...prev, ""]), []);

  const removeEjemplar = useCallback((index) =>
    setEjemplaresSeleccionados(prev =>
      prev.filter((_, i) => i !== index)
    ), []);

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};

    // Validar nombre del usuario
    if (!formData.usuarioId.trim()) {
      nuevosErrores.usuarioId = "El nombre del usuario es requerido";
    }

    // Validar ejemplares
    const ejemplaresVacios = ejemplaresSeleccionados.some((ej) => !ej.trim());
    if (ejemplaresVacios) {
      nuevosErrores.ejemplares = "Ingresar ejemplar";
    }

    // Validar fecha de préstamo
    if (!fechaPrestamo) {
      nuevosErrores.fechaPrestamo = "La fecha de préstamo es requerida";
    }

    // Validar fecha de devolución
    if (!fechaDevolucion) {
      nuevosErrores.fechaDevolucion =
        "La fecha de devolución estimada es requerida";
    } else if (fechaPrestamo) {
      // Comparar las fechas como strings YYYY-MM-DD
      const fechaPrestamoStr = fechaPrestamo.toISOString().split("T")[0];
      const fechaDevolucionStr = fechaDevolucion.toISOString().split("T")[0];

      if (fechaDevolucionStr < fechaPrestamoStr) {
        nuevosErrores.fechaDevolucion =
          "La fecha de devolución debe ser mayor o igual a la fecha de préstamo";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [formData.usuarioId, ejemplaresSeleccionados, fechaPrestamo, fechaDevolucion]);

  const handleGuardarPrestamo = useCallback(() => {
    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    // Simular guardado en base de datos luego se quita o rediseña
    setTimeout(() => {
      console.log("Datos del préstamo:", {
        usuarioId: formData.usuarioId,
        ejemplares: ejemplaresSeleccionados,
        fechaPrestamo: fechaPrestamo,
        fechaDevolucionEstimada: fechaDevolucion,
      });

      setGuardando(false);
      handleClose();

      // Mostrar toast de éxito
      setToastMessage(
        `Préstamo de ${formData.usuarioId} agregado correctamente`
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1000);
  }, [validarFormulario, formData.usuarioId, ejemplaresSeleccionados, fechaPrestamo, fechaDevolucion]);

  const handleDevolverPrestamo = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setNuevaFechaDevolucion(null);
    setFechaRenovada(false);
    setShowModalDevolver(true);
  }, []);

  const confirmarDevolucion = useCallback(() => {
    // Simular devolución
    setTimeout(() => {
      handleClose();
      setToastMessage(
        `Libro "${prestamoSeleccionado.libro}" devuelto correctamente`
      );
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 500);
  }, [prestamoSeleccionado]);

  // Función para renovar préstamo desde la lista
  const handleRenovarPrestamoLista = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setNuevaFechaDevolucion(null);
    setErrorRenovacion("");
    setShowModalRenovar(true);
  }, []);

  // Manejar cambio de fecha en renovación
  const handleFechaRenovacionChange = useCallback((date) => {
    setNuevaFechaDevolucion(date);
    if (errorRenovacion) setErrorRenovacion("");
  }, [errorRenovacion]);

  //Renovar Prestamo
  const handleRenovarPrestamo = useCallback(() => {
    if (!nuevaFechaDevolucion) {
      setErrorRenovacion("Debe seleccionar una nueva fecha de devolución");
      return;
    }
    setErrorRenovacion("");

    setTimeout(() => {
      handleClose();
      setToastMessage(
        `Préstamo de "${prestamoSeleccionado.libro}" renovado hasta ${nuevaFechaDevolucion.toISOString().split("T")[0]}`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 500);
  }, [nuevaFechaDevolucion, prestamoSeleccionado]);

  const verDetalles = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalDetalles(true);
  }, []);

  // Función para abrir notificaciones de correo electrónico
  const abrirNotificaciones = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setMostrarNotificaciones(true);
  }, []);

  // Función para volver a préstamos
  const volverPrestamos = useCallback(() => {
    setMostrarNotificaciones(false);
    setPrestamoSeleccionado(null);
  }, []);

  // REDIRECCIÓN A PANTALLA DE NOTIFICACIONES
  if (mostrarNotificaciones) {
    return (
      <NotificacionesCorreo
        volverPrestamos={volverPrestamos}
        prestamo={prestamoSeleccionado}
      />
    );
  }

  // Función para formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return "No definida";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES");
  };

  // Función para determinar el estado visual basado en el estado real
  const obtenerEstadoVisual = (prestamo) => {
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
  };

  // Función para determinar la clase CSS del estado
  const obtenerClaseEstado = (prestamo) => {
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
  };

  //FILTRADO CON BÚSQUEDA Y ESTADO
  const prestamosFiltrados = useMemo(() => {
    return prestamos.filter((p) => {
      // Filtro por texto de búsqueda
      const searchValue = searchRef.current?.toLowerCase() || '';
      const cumpleFiltroTexto = !searchValue || 
        p.usuario.toLowerCase().includes(searchValue) ||
        p.libro.toLowerCase().includes(searchValue) ||
        p.codigo.toLowerCase().includes(searchValue);

      // Filtro por estado
      const cumpleFiltroEstado = 
        filtro === "Todos" ||
        (filtro === "Activos" && p.estado === "activo") ||
        (filtro === "Atrasados" && p.estado === "retrasado") ||
        (filtro === "Devueltos" && p.estado === "cerrado");

      return cumpleFiltroTexto && cumpleFiltroEstado;
    });
  }, [prestamos, filtro]); // No incluir searchRef.current en dependencies

  console.count('PrestamoVista render');

  //-----------------INICIO DE RETURN-----------------
  return (
    <div className={global.backgroundWrapper}>
      {/* Toast de éxito */}
      <Toast show={showToast} message={toastMessage} />

      {/* Header */}
      <AppHeader onHomeClick={volverMenu} />

      {/* Título */}
      <PageTitle title="Préstamos" />

      {/* CONTENEDOR PRINCIPAL: BOTONES LATERAL + PANEL DE PRÉSTAMOS */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* ------------------ PANEL DE BOTONES LATERAL ------------------ */}
          <div className="col-md-3 col-lg-2 mb-4">
            <FilterPanel 
              filtro={filtro}
              onFiltroChange={setFiltro}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          {/* ------------------ PANEL DE PRÉSTAMOS ------------------ */}
          <div className="col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              {/* Buscador y botón nuevo préstamo */}
              <SearchSection 
                onSearchChange={handleBusqueda}
                onNewItem={handleShow}
              />
        
             {/* Listado de préstamos CON SCROLL */}
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

      {/* Modales */}
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