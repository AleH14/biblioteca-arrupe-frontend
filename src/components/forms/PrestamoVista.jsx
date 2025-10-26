"use client";
import React, { useState } from "react";
import styles from "../../styles/PrestamoVista.module.css";
import global from "../../styles/Global.module.css";
import { FiHome, FiBell, FiCalendar, FiUser, FiBook, FiMapPin } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NotificacionesCorreo from "./NotificacionesCorreo";

export default function PrestamoVista({ volverMenu }) {
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
      usuario: "Maria Gonzalez", //se mandan a traer de coleccion usuarios
      libro: "Cien Años de Soledad", //tambien acá
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
  const [ejemplaresSeleccionados, setEjemplaresSeleccionados] = useState([""]);
  const [filtro, setFiltro] = useState("Todos");
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date());
  const [fechaDevolucion, setFechaDevolucion] = useState(null);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [nuevaFechaDevolucion, setNuevaFechaDevolucion] = useState(null);
  const [fechaRenovada, setFechaRenovada] = useState(false);
  const [errorRenovacion, setErrorRenovacion] = useState("");

  const [formData, setFormData] = useState({
    usuarioId: "",
    correo: "",
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setShowModalDevolver(false);
    setShowModalDetalles(false);
    setErrores({});
    setFormData({ usuarioId: "", correo: "" });
    setEjemplaresSeleccionados([""]);
    setFechaPrestamo(new Date());
    setFechaDevolucion(null);
    setPrestamoSeleccionado(null);
    setNuevaFechaDevolucion(null);
    setFechaRenovada(false);
    setErrorRenovacion(null);
  };

  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
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
  };

  const handleEjemplarChange = (index, value) => {
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
  };

  const addEjemplar = () =>
    setEjemplaresSeleccionados([...ejemplaresSeleccionados, ""]);

  const removeEjemplar = (index) =>
    setEjemplaresSeleccionados(
      ejemplaresSeleccionados.filter((_, i) => i !== index)
    );

  const validarFormulario = () => {
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
  };

  const handleGuardarPrestamo = () => {
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
  };

  const handleDevolverPrestamo = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setNuevaFechaDevolucion(null);
    setFechaRenovada(false);
    setShowModalDevolver(true);
  };

  const confirmarDevolucion = () => {
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
  };

  //Renovar Prestamo
  const handleRenovarPrestamo = () => {
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
};
  const verDetalles = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalDetalles(true);
  };

  // Función para abrir notificaciones de correo electrónico
  const abrirNotificaciones = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setMostrarNotificaciones(true);
  };

  // Función para volver a préstamos
  const volverPrestamos = () => {
    setMostrarNotificaciones(false);
    setPrestamoSeleccionado(null);
  };

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

  //FILTRADO
  const prestamosFiltrados = prestamos.filter(
    (p) =>
      filtro === "Todos" ||
      (filtro === "Activos" && p.estado === "activo") ||
      (filtro === "Atrasados" && p.estado === "retrasado") ||
      (filtro === "Devueltos" && p.estado === "cerrado")
  );

  //-----------------INICIO DE RETURN-----------------
  return (
    <div className={global.backgroundWrapper}>
      {/* Toast de éxito */}
      {showToast && (
        <div className={styles.toastSuccess}>
          <div className={styles.toastContent}>
            <span className={styles.toastIcon}>✓</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`${global.header} d-flex justify-content-between align-items-center`}
      >
        <button className={global.homeBtn} onClick={volverMenu}>
          <FiHome className={global.homeIcon} />
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Título */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={global.complementoImg + " me-2"}
              />
              <h1 className={`${global.title} mb-0`}>Préstamos</h1>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: BOTONES LATERAL + PANEL DE PRÉSTAMOS */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* ------------------ PANEL DE BOTONES LATERAL ------------------ */}
          <div className="col-md-3 col-lg-2 mb-4">
            <div className={styles.sidebarPanel}>
              <button className={`${global.btnSecondary} w-100 mb-3`}>
                Generar Informe
              </button>

              <div className={styles.filterSection}>
                <small className={styles.filterLabel}>Clasificación</small>
                <div className={styles.filterButtons}>
                  {["Todos", "Activos", "Atrasados", "Devueltos"].map((tipo) => (
                    <button
                      key={tipo}
                      className={`${styles.filterBtn} ${
                        filtro === tipo
                          ? styles.filterBtnActive
                          : styles.filterBtnInactive
                      }`}
                      onClick={() => setFiltro(tipo)}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------ PANEL DE PRÉSTAMOS ------------------ */}
          <div className="col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              {/* Buscador y botón nuevo préstamo */}
              <div className={styles.searchSection}>
                <div className="d-flex gap-2 flex-column flex-md-row">
                  <input
                    type="text"
                    placeholder="Buscar préstamo"
                    className={`${styles.searchInput} flex-grow-1`}
                  />
                  <button className={global.btnPrimary} onClick={handleShow}>
                    <span className={global.btnPrimaryMas}>+</span> Nuevo
                    Préstamo
                  </button>
                </div>
              </div>
        
             {/* Listado de préstamos CON SCROLL */}
              <div className={styles.loansListContainer}>
                <div className={styles.loansList}>
                  {prestamosFiltrados.map((p) => (
                    <div key={p._id} className={styles.card}>
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
                        <div className={styles.loanInfo}>
                          <strong>{p.usuario}</strong>
                          <br />
                          <small>{p.libro}</small>
                          <br />
                          <small className={styles.fecha}>
                            Préstamo: {formatearFecha(p.fechaPrestamo)}
                          </small>
                        </div>
                        <div className={styles.loanStatus}>
                          <span className={obtenerClaseEstado(p)}>
                            {obtenerEstadoVisual(p)}
                          </span>
                          <br />
                          <small className={styles.fecha}>
                            {p.fechaDevolucionReal
                              ? `Devuelto: ${formatearFecha(
                                  p.fechaDevolucionReal
                                )}`
                              : `Vence: ${formatearFecha(
                                  p.fechaDevolucionEstimada
                                )}`}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className={global.btnSecondary}
                            onClick={() =>
                              p.estado === "cerrado"
                                ? verDetalles(p)
                                : handleDevolverPrestamo(p)
                            }
                          >
                            {p.estado === "cerrado"
                              ? "Ver Detalles"
                              : "Devolver"}
                          </button>
                          {/* Botón de Notificaciones en cada card */}
                          <button
                            className={styles.notificationBtn}
                            onClick={() => abrirNotificaciones(p)}
                            title="Enviar notificación"
                          >
                            <FiBell className={styles.notificationIcon} />
                            {p.notificaciones &&
                              p.notificaciones.length > 0 && (
                                <span className={styles.notificationNumber}>
                                  {p.notificaciones.length}
                                </span>
                              )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal NUEVO PRÉSTAMO */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Préstamo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="usuarioId"
                      value={formData.usuarioId}
                      onChange={handleInputChange}
                      className={`${styles.inputForm} form-control ${
                        errores.usuarioId ? styles.inputError : ""
                      }`}
                      placeholder="Ingrese el nombre del usuario"
                      required
                    />
                    {errores.usuarioId && (
                      <div className={styles.errorMessage}>
                        {errores.usuarioId}
                      </div>
                    )}
                  </div>

                  <label className="form-label">Ejemplar</label>
                  {errores.ejemplares && (
                    <div className={styles.errorMessage}>
                      {errores.ejemplares}
                    </div>
                  )}
                  <br />
                  {ejemplaresSeleccionados.map((ej, index) => (
                    <div className="mb-3 d-flex" key={index}>
                      <input
                        type="text"
                        value={ej}
                        onChange={(e) =>
                          handleEjemplarChange(index, e.target.value)
                        }
                        className={`${styles.inputForm} form-control me-2 ${
                          errores.ejemplares ? styles.inputError : ""
                        }`}
                        placeholder="Ingrese el ejemplar"
                        required
                      />
                      {ejemplaresSeleccionados.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => removeEjemplar(index)}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={addEjemplar}
                  >
                    + Añadir otro Ejemplar
                  </button>

                  <div className="mb-3">
                    <label className="form-label">Fecha de Préstamo</label>
                    <DatePicker
                      selected={fechaPrestamo}
                      onChange={setFechaPrestamo}
                      className={`${styles.datePickerInput} form-control ${
                        errores.fechaPrestamo ? styles.inputError : ""
                      }`}
                      placeholderText="Selecciona fecha"
                      dateFormat="yyyy-MM-dd"
                      required
                    />
                    {errores.fechaPrestamo && (
                      <div className={styles.errorMessage}>
                        {errores.fechaPrestamo}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Fecha de Devolución Estimada
                    </label>
                    <DatePicker
                      selected={fechaDevolucion}
                      onChange={setFechaDevolucion}
                      minDate={fechaPrestamo}
                      className={`${styles.datePickerInput} form-control ${
                        errores.fechaDevolucion ? styles.inputError : ""
                      }`}
                      placeholderText="Selecciona fecha"
                      dateFormat="yyyy-MM-dd"
                      required
                    />
                    {errores.fechaDevolucion && (
                      <div className={styles.errorMessage}>
                        {errores.fechaDevolucion}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`${global.btnPrimary} ${
                      guardando ? styles.loading : ""
                    }`}
                    onClick={handleGuardarPrestamo}
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar Préstamo"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal CONFIRMAR DEVOLUCIÓN */}
        {showModalDevolver && prestamoSeleccionado && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Devolución</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className={styles.confirmacionContent}>
                    {/* Información del préstamo */}
                    <h6>¿Está seguro que desea registrar la devolución?</h6>
                    <div className={styles.confirmacionInfo}>
                      <p><strong>Libro:</strong> {prestamoSeleccionado.libro}</p>
                      <p><strong>Usuario:</strong> {prestamoSeleccionado.usuario}</p>
                      <p><strong>Ubicación:</strong> Edificio X</p>
                      <p><strong>Fecha préstamo:</strong> {formatearFecha(prestamoSeleccionado.fechaPrestamo)}</p>
                      <p><strong>Vencía:</strong> {formatearFecha(prestamoSeleccionado.fechaDevolucionEstimada)}</p>
                    </div>

                    {/* SECCIÓN DE RENOVACIÓN */}
                    <hr className={styles.separador}/>
                    <h6>Renovar préstamo</h6>
                    <div className={styles.datepickerContainer}>
                      <div className={styles.datepickerWrapper}>
                        <DatePicker
                          selected={nuevaFechaDevolucion}
                          onChange={(date) => {
                            setNuevaFechaDevolucion(date);
                            if (errorRenovacion) setErrorRenovacion("");
                          }}
                          minDate={new Date()}
                          className={`${styles.datePickerInput} form-control`}
                          placeholderText="Selecciona nueva fecha"
                          dateFormat="yyyy-MM-dd"
                        />
                        
                        <div className={styles.datepickerError}>
                          {errorRenovacion || ""}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (!nuevaFechaDevolucion) {
                        setErrorRenovacion("Debe seleccionar una nueva fecha de devolución");
                        return;
                      }
                      // Renovación simulada
                      setTimeout(() => {
                        handleClose();
                        setToastMessage(
                          `Préstamo de "${prestamoSeleccionado.libro}" renovado hasta ${nuevaFechaDevolucion.toISOString().split("T")[0]}`
                        );
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }, 500);
                    }}
                  >
                    Renovar
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={confirmarDevolucion}
                  >
                    Confirmar Devolución
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Modal VER DETALLES */}
      {showModalDetalles && prestamoSeleccionado && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Préstamo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className={styles.detallesContent}>
                  <div className={styles.detalleItem}>
                    <FiUser className={styles.detalleIcon} />
                    <div>
                      <strong>Usuario:</strong>
                      <span>{prestamoSeleccionado.usuario}</span>
                    </div>
                  </div>
                  <div className={styles.detalleItem}>
                    <FiBook className={styles.detalleIcon} />
                    <div>
                      <strong>Libro:</strong>
                      <span>{prestamoSeleccionado.libro}</span>
                    </div>
                  </div>

                  <div className={styles.detalleItem}>
                    <FiMapPin className={styles.detalleIcon} />
                    <div>
                      <strong>Ubicación:</strong>
                      <span>Edificio X</span>
                    </div>
                  </div>

                  <div className={styles.detalleItem}>
                    <FiCalendar className={styles.detalleIcon} />
                    <div>
                      <strong>Fecha de Préstamo:</strong>
                      <span>
                        {formatearFecha(prestamoSeleccionado.fechaPrestamo)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detalleItem}>
                    <FiCalendar className={styles.detalleIcon} />
                    <div>
                      <strong>Fecha Devolución Estimada:</strong>
                      <span>
                        {formatearFecha(
                          prestamoSeleccionado.fechaDevolucionEstimada
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detalleItem}>
                    <FiCalendar className={styles.detalleIcon} />
                    <div>
                      <strong>Fecha Devolución Real:</strong>
                      <span
                        className={
                          prestamoSeleccionado.fechaDevolucionReal
                            ? styles.fechaReal
                            : styles.fechaPendiente
                        }
                      >
                        {prestamoSeleccionado.fechaDevolucionReal
                          ? formatearFecha(
                              prestamoSeleccionado.fechaDevolucionReal
                            )
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detalleItem}>
                    <div className={styles.estadoContainer}>
                      <strong>Estado:</strong>
                      <span
                        className={obtenerClaseEstado(prestamoSeleccionado)}
                      >
                        {obtenerEstadoVisual(prestamoSeleccionado)}
                      </span>
                    </div>
                  </div>
                  {prestamoSeleccionado.notificaciones &&
                    prestamoSeleccionado.notificaciones.length > 0 && (
                      <div className={styles.notificacionesSection}>
                        <h6>Notificaciones Enviadas</h6>
                        {prestamoSeleccionado.notificaciones.map(
                          (notif, index) => (
                            <div
                              key={index}
                              className={styles.notificacionItem}
                            >
                              <small>
                                <strong>{notif.asunto}</strong> -{" "}
                                {formatearFecha(notif.fechaEnvio)}
                              </small>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
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