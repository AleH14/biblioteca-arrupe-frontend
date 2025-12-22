"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "react-datepicker/dist/react-datepicker.css";

// Estilos
import styles from "@/styles/PrestamoVista.module.css";
import global from "@/styles/Global.module.css";

// Componentes UI generales
import Toast from "@/components/ui/Toast";
import AppHeader from "@/components/ui/AppHeader";
import PageTitle from "@/components/ui/PageTitle";

// Componentes de préstamos
import {
  FilterPanel,
  SearchSection,
  PrestamoCard,
  NuevoPrestamoModal,
  RenovarPrestamoModal,
  ConfirmarDevolucionModal,
  DetallesPrestamoModal,
  ConfirmarPrestamoModal,
} from "@/components/ui/prestamos";

import { PrestamoService } from "@/services";

export default function PrestamosPage() {
  const router = useRouter();
  const { logout } = useAuth();

  // Estados de datos
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados principales
  const [showModal, setShowModal] = useState(false);
  const [showModalDevolver, setShowModalDevolver] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [showModalRenovar, setShowModalRenovar] = useState(false);
  const [showModalConfirmarPrestamo, setShowModalConfirmarPrestamo] =
    useState(false);
  const [filtro, setFiltro] = useState("Todos");
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date());
  const [fechaDevolucion, setFechaDevolucion] = useState(null);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [nuevaFechaDevolucion, setNuevaFechaDevolucion] = useState(null);
  const [errorRenovacion, setErrorRenovacion] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [formData, setFormData] = useState({
    usuarioId: "",
    tipoPrestamo: "",
    ejemplaresAgregados: []
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Cargar préstamos desde la API
  const cargarPrestamos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PrestamoService.obtenerTodosLosPrestamos();
      
      if (response.success) {
        // Normalizar datos para que coincidan con lo que esperan los componentes
        const prestamosNormalizados = (response.data || []).map(prestamo => ({
          // Mantener ID del préstamo
          _id: prestamo.id || prestamo._id,
          
          // Normalizar usuario - el backend devuelve 'alumno'
          usuario: prestamo.alumno?.nombre || prestamo.usuario || "Usuario desconocido",
          usuarioId: prestamo.alumno, // Mantener referencia al objeto completo
          
          // Normalizar libro - el backend devuelve 'libro' como objeto
          libro: prestamo.libro?.titulo || "Libro desconocido",
          libroId: prestamo.libro, // Mantener referencia al objeto completo
          
          // Normalizar ejemplar - el backend devuelve 'ejemplar'
          ejemplarId: prestamo.ejemplar?.id || prestamo.ejemplar,
          ejemplar: prestamo.ejemplar, // Mantener referencia al objeto completo
          
          // Normalizar fechas - el backend usa nombres diferentes
          fechaPrestamo: prestamo.fechaPrestamo,
          fechaDevolucionEstimada: prestamo.fechaVencimiento || prestamo.fechaDevolucionEstimada,
          fechaDevolucionReal: prestamo.fechaDevolucionReal,
          
          // Estado y otros campos
          estado: prestamo.estado,
          reserva: prestamo.reserva,
          diasRetraso: prestamo.diasRetraso,
          
          // Notificaciones (si existen)
          notificaciones: prestamo.notificaciones || [],
        }));
        
        setPrestamos(prestamosNormalizados);
      } else {
        setError(response.message || "Error al cargar préstamos");
      }
    } catch (err) {
      console.error("Error al cargar préstamos:", err);
      setError("Error al cargar los préstamos. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setShowModalDevolver(false);
    setShowModalDetalles(false);
    setShowModalRenovar(false);
    setShowModalConfirmarPrestamo(false);
    setErrores({});
    setFormData({ usuarioId: "", tipoPrestamo: "", ejemplaresAgregados: [] });
    setFechaPrestamo(new Date());
    setFechaDevolucion(null);
    setPrestamoSeleccionado(null);
    setNuevaFechaDevolucion(null);
    setErrorRenovacion("");
  }, []);

  const handleBusqueda = useCallback((value) => {
    setSearchValue(value);
  }, []);

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

  // Funciones de búsqueda para el modal
  const buscarLibros = useCallback(async (query) => {
    return await PrestamoService.buscarLibrosParaPrestamo(query);
  }, []);

  const buscarUsuarios = useCallback(async (query) => {
    return await PrestamoService.buscarUsuariosParaPrestamo(query);
  }, []);

  const validarFormulario = useCallback((datosFormulario) => {
    const nuevosErrores = {};
    
    if (!datosFormulario.tipoPrestamo) {
      nuevosErrores.tipoPrestamo = "Seleccione el tipo de préstamo";
    }

    if (!datosFormulario.usuarioId.trim()) {
      nuevosErrores.usuarioId = "El nombre del usuario es requerido";
    }

    if (!datosFormulario.ejemplaresAgregados || datosFormulario.ejemplaresAgregados.length === 0) {
      nuevosErrores.libro = "Debe agregar al menos un ejemplar";
    }

    if (!fechaPrestamo) {
      nuevosErrores.fechaPrestamo = "La fecha de préstamo es requerida";
    }

    if (!fechaDevolucion) {
      nuevosErrores.fechaDevolucion = "La fecha de devolución estimada es requerida";
    } else if (fechaPrestamo) {
      const fechaPrestamoStr = fechaPrestamo.toISOString().split("T")[0];
      const fechaDevolucionStr = fechaDevolucion.toISOString().split("T")[0];
      if (fechaDevolucionStr <= fechaPrestamoStr) {
        nuevosErrores.fechaDevolucion =
          "La fecha de devolución debe ser posterior (al menos un día después) a la fecha de préstamo";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }, [fechaPrestamo, fechaDevolucion]);

  const handleGuardarPrestamo = useCallback(async (datosCompletos) => {
    if (!validarFormulario(datosCompletos)) return;

    setGuardando(true);
    try {
      const { ejemplaresAgregados, usuarioId, tipoPrestamo } = datosCompletos;
      
      // Buscar el usuario por nombre
      const usuariosResponse = await PrestamoService.buscarUsuariosParaPrestamo(usuarioId);
      
      if (!usuariosResponse.success || !usuariosResponse.data || usuariosResponse.data.length === 0) {
        setErrores({ usuarioId: "No se encontró un usuario con ese nombre" });
        setGuardando(false);
        return;
      }

      const usuario = usuariosResponse.data[0];
      
      // Ajustar fechas al inicio del día local para evitar problemas de zona horaria
      const fechaPrestamoAjustada = new Date(fechaPrestamo);
      fechaPrestamoAjustada.setHours(12, 0, 0, 0); // Medio día para evitar problemas con UTC
      
      const fechaDevolucionAjustada = new Date(fechaDevolucion);
      fechaDevolucionAjustada.setHours(12, 0, 0, 0); // Medio día para evitar problemas con UTC
      
      // Crear múltiples préstamos (uno por cada ejemplar)
      const promesas = ejemplaresAgregados.map(item => {
        const libroId = item.libro.id || item.libro._id;
        const ejemplarId = item.ejemplar.id || item.ejemplar._id;
        const usuarioIdFinal = usuario.id || usuario._id;
        
        return PrestamoService.crearPrestamoConBusqueda(
          libroId,
          ejemplarId,
          usuarioIdFinal,
          fechaPrestamoAjustada.toISOString(),
          fechaDevolucionAjustada.toISOString(),
          tipoPrestamo
        );
      });

      // Ejecutar todos los préstamos en paralelo
      const resultados = await Promise.allSettled(promesas);
      
      // Verificar resultados
      const exitosos = resultados.filter(r => r.status === 'fulfilled' && r.value.success);
      const fallidos = resultados.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
      
      if (exitosos.length > 0) {
        handleClose();
        await cargarPrestamos();
        
        if (fallidos.length === 0) {
          setToastMessage(`${exitosos.length} préstamo(s) creado(s) correctamente para ${usuario.nombre}`);
        } else {
          setToastMessage(`${exitosos.length} préstamo(s) creado(s). ${fallidos.length} fallaron.`);
        }
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setErrores({ general: "No se pudo crear ningún préstamo. Verifique los datos e intente nuevamente." });
      }
    } catch (error) {
      console.error("Error al guardar préstamos:", error);
      setErrores({ 
        general: error.response?.data?.message || "Error al crear los préstamos. Intente nuevamente." 
      });
    } finally {
      setGuardando(false);
    }
  }, [validarFormulario, fechaPrestamo, fechaDevolucion, handleClose, cargarPrestamos]);

  const handleDevolverPrestamo = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalDevolver(true);
  }, []);

  const handleRenovarPrestamoLista = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setNuevaFechaDevolucion(null);
    setErrorRenovacion("");
    setShowModalRenovar(true);
  }, []);

  const confirmarDevolucion = useCallback(async () => {
    try {
      const response = await PrestamoService.cerrarPrestamo(prestamoSeleccionado._id);
      
      if (response.success) {
        handleClose();
        await cargarPrestamos();
        setToastMessage(
          `Libro "${prestamoSeleccionado?.libro || prestamoSeleccionado?.libroId?.titulo}" devuelto correctamente`
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage(response.message || "Error al registrar la devolución");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error al confirmar devolución:", error);
      setToastMessage(
        error.response?.data?.message || "Error al registrar la devolución. Intente nuevamente."
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [prestamoSeleccionado, handleClose, cargarPrestamos]);

  const handlePrestarReserva = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalConfirmarPrestamo(true);
  }, []);

  const handleFechaRenovacionChange = useCallback(
    (date) => {
      setNuevaFechaDevolucion(date);
      if (errorRenovacion) setErrorRenovacion("");
    },
    [errorRenovacion]
  );

  const handleRenovarPrestamo = useCallback(async () => {
    if (!nuevaFechaDevolucion) {
      setErrorRenovacion("Debe seleccionar una nueva fecha de devolución");
      return;
    }
    
    // Validar que la nueva fecha sea posterior a la fecha actual de devolución
    const fechaActual = new Date(prestamoSeleccionado.fechaDevolucionEstimada);
    if (nuevaFechaDevolucion <= fechaActual) {
      setErrorRenovacion("La nueva fecha debe ser posterior a la fecha de devolución actual");
      return;
    }
    
    setErrorRenovacion("");
    
    try {
      const response = await PrestamoService.renovarPrestamo(
        prestamoSeleccionado._id,
        nuevaFechaDevolucion.toISOString()
      );
      
      if (response.success) {
        handleClose();
        await cargarPrestamos();
        setToastMessage(
          `Préstamo de "${prestamoSeleccionado?.libro || prestamoSeleccionado?.libroId?.titulo}" renovado hasta ${
            nuevaFechaDevolucion.toLocaleDateString("es-ES")
          }`
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setErrorRenovacion(response.message || "Error al renovar el préstamo");
      }
    } catch (error) {
      console.error("Error al renovar préstamo:", error);
      setErrorRenovacion(
        error.response?.data?.message || "Error al renovar el préstamo. Intente nuevamente."
      );
    }
  }, [nuevaFechaDevolucion, prestamoSeleccionado, handleClose, cargarPrestamos]);

  const confirmarPrestamo = useCallback(
    async (fechaDevolucionEstimada) => {
      try {
        const response = await PrestamoService.activarReserva(prestamoSeleccionado._id);
        
        if (response.success) {
          handleClose();
          await cargarPrestamos();
          setToastMessage(
            `Préstamo de "${prestamoSeleccionado?.libro || prestamoSeleccionado?.libroId?.titulo}" confirmado para ${
              prestamoSeleccionado?.usuario || prestamoSeleccionado?.usuarioId?.nombre
            }`
          );
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } else {
          setToastMessage(response.message || "Error al activar la reserva");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error("Error al confirmar préstamo:", error);
        setToastMessage(
          error.response?.data?.message || "Error al activar la reserva. Intente nuevamente."
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    },
    [prestamoSeleccionado, handleClose, cargarPrestamos]
  );

  const verDetalles = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setShowModalDetalles(true);
  }, []);

  const abrirNotificaciones = useCallback((prestamo) => {
    setPrestamoSeleccionado(prestamo);
    router.push(`/dashboard/prestamos/notificaciones?id=${prestamo._id}`);
  }, [router]);

  const formatearFecha = useCallback((fechaString) => {
    if (!fechaString) return "No definida";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES");
  }, []);

  const obtenerEstadoVisual = useCallback((prestamo) => {
    switch (prestamo.estado) {
      case "activo":
        return "Activo";
      case "vencido":
      case "retrasado":
        return "Entrega Retrasada";
      case "devuelto":
      case "cerrado":
        return "Devuelto";
      case "reservado":
        return "Reservado";
      default:
        return prestamo.estado;
    }
  }, []);

  const obtenerClaseEstado = useCallback(
    (prestamo) => {
      switch (prestamo.estado) {
        case "activo":
          return styles.estadoActivo;
        case "vencido":
        case "retrasado":
          return styles.estadoRetrasado;
        case "devuelto":
        case "cerrado":
          return styles.estadoCerrado;
        case "reservado":
          return styles.estadoReservado;
        default:
          return styles.estadoActivo;
      }
    },
    [styles]
  );

  const prestamosFiltrados = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return prestamos.filter((p) => {
      // Adaptar nombres de campos del backend
      const nombreUsuario = p.usuarioId?.nombre || p.usuario || "";
      const nombreLibro = p.libroId?.titulo || p.libro || "";
      
      const cumpleFiltroTexto =
        !searchValue ||
        nombreUsuario.toLowerCase().includes(searchLower) ||
        nombreLibro.toLowerCase().includes(searchLower);
      
      const cumpleFiltroEstado =
        filtro === "Todos" ||
        (filtro === "Activos" && p.estado === "activo") ||
        (filtro === "Atrasados" && (p.estado === "retrasado" || p.estado === "vencido")) ||
        (filtro === "Devueltos" && (p.estado === "cerrado" || p.estado === "devuelto")) ||
        (filtro === "Reservados" && p.estado === "reservado");
      return cumpleFiltroTexto && cumpleFiltroEstado;
    });
  }, [prestamos, filtro, searchValue]);

  return (
    <div className={global.backgroundWrapper}>
      <Toast show={showToast} message={toastMessage} />

      {/* HEADER */}
      <AppHeader />

      <PageTitle title="Préstamos" />

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-3 col-lg-2 mb-4">
            <FilterPanel
              filtro={filtro}
              onFiltroChange={setFiltro}
              filters={[
                "Todos",
                "Activos",
                "Atrasados",
                "Devueltos",
                "Reservados",
              ]}
            />
          </div>

          <div className="col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              <SearchSection
                onSearchChange={handleBusqueda}
                onNewItem={() => setShowModal(true)}
              />

              {loading && (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando préstamos...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger m-3" role="alert">
                  {error}
                  <button 
                    className="btn btn-link" 
                    onClick={cargarPrestamos}
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !error && prestamosFiltrados.length === 0 && (
                <div className="alert alert-info m-3" role="alert">
                  No se encontraron préstamos.
                </div>
              )}

              {!loading && !error && prestamosFiltrados.length > 0 && (
                <div className={styles.loansListContainer}>
                  <div className={styles.loansList}>
                    {prestamosFiltrados.map((p) => (
                      <PrestamoCard
                        key={p._id}
                        prestamo={p}
                        onRenovar={handleRenovarPrestamoLista}
                        onDevolver={handleDevolverPrestamo}
                        onVerDetalles={verDetalles}
                        onNotificaciones={() => abrirNotificaciones(p)}
                        onPrestarReserva={handlePrestarReserva}
                        formatearFecha={formatearFecha}
                        obtenerEstadoVisual={obtenerEstadoVisual}
                        obtenerClaseEstado={obtenerClaseEstado}
                      />
                    ))}
                  </div>
                </div>
              )}
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
        buscarLibros={buscarLibros}
        buscarUsuarios={buscarUsuarios}
        fechaPrestamo={fechaPrestamo}
        onFechaPrestamoChange={setFechaPrestamo}
        fechaDevolucion={fechaDevolucion}
        onFechaDevolucionChange={setFechaDevolucion}
        onGuardar={handleGuardarPrestamo}
        guardando={guardando}
      />

      {errores.general && (
        <Toast 
          show={!!errores.general} 
          message={errores.general}
          type="error"
        />
      )}

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

      <ConfirmarPrestamoModal
        show={showModalConfirmarPrestamo}
        onClose={handleClose}
        prestamo={prestamoSeleccionado}
        onConfirmar={confirmarPrestamo}
        formatearFecha={formatearFecha}
      />
    </div>
  );
}
  