"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/IntEstudiantes.module.css";
import { 
  reservarLibro,
  obtenerMisReservas,
  obtenerMisPrestamos 
} from "@/services/prestamoService";

// Componentes UI específicos de esta página
import Menu from "@/components/ui/intestudiantes/MenuEstudiante";
import SearchBar from "@/components/ui/intestudiantes/SearchBarEstudiante";
import Filters from "@/components/ui/intestudiantes/FiltersEstudiante";
import BookCard from "@/components/ui/intestudiantes/BookCardEstudiante";
import ActivityItems from "@/components/ui/intestudiantes/ActivityItemsEstudiante";
import ReservationModal from "@/components/ui/intestudiantes/ReservationModal";
import Toast from "@/components/ui/Toast";

// Hook personalizado
import { useDebounce } from "../../hooks/useDebounce";

// Services
import { getLibros, getAllCategorias } from "@/services/librosService";

//Validacion fecha expiracion reserva
const esReservaVigente = (reserva) => {
      if (!reserva?.fechaExpiracion) return false;

      const hoy = new Date();
      const fechaExp = new Date(reserva.fechaExpiracion);

      hoy.setHours(0, 0, 0, 0);
      fechaExp.setHours(0, 0, 0, 0);

      return hoy <= fechaExp; // true si todavía está vigente
    };

export default function InterfazEstudiantes() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Estados principales
  const [vistaActual, setVistaActual] = useState("catalogo");
  const [listaLibros, setListaLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [libroAReservar, setLibroAReservar] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Estados para préstamos y reservas
  const [listaPrestamos, setListaPrestamos] = useState([]);
  const [listaReservas, setListaReservas] = useState([]);
  const [cargandoActividad, setCargandoActividad] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Búsqueda y filtros
  const [busquedaInmediata, setBusquedaInmediata] = useState("");
  const [filtros, setFiltros] = useState({
    categoria: "",
    autor: "",
    editorial: "",
  });

  const busquedaDebounced = useDebounce(busquedaInmediata, 300);

  // =============================
  // Nombre usuario
  // =============================
  const userName = useMemo(() => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "Usuario";
  }, [user]);

  // =============================
  // Obtener ID del usuario
  // =============================
  const getUserId = useCallback(() => {
    return user?._id || user?.id || user?.sub;
  }, [user]);

  // =============================
  // Cargar MIS RESERVAS
  // =============================
  const cargarMisReservas = useCallback(async () => {
    if (!user) return [];
    
    try {
      const response = await obtenerMisReservas();
      
      
      if (response?.success && response.data) {
        return response.data.map(reserva => ({
          _id: reserva.id || reserva._id,
          libroId: reserva.libro?._id,
          libro: reserva.libro?.titulo || "Libro sin título",
          portada: reserva.libro?.imagenURL || "/images/librodefault.png",
          usuario: reserva.usuario?.nombre || userName,
          fechaReserva: reserva.reserva?.fechaReserva,
          fechaExpiracion: reserva.reserva?.fechaExpiracion,
          estado: "reservado"
        }));
      }
      return [];
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      return [];
    }
  }, [user, userName]);

  // =============================
  // Cargar MIS PRÉSTAMOS (SIN LÓGICA DE RETRASO)
  // =============================
  const cargarMisPrestamos = useCallback(async () => {
    if (!user) return [];
    
    try {
      const response = await obtenerMisPrestamos();
      
      if (response?.success && response.data) {
        return response.data.map(prestamo => ({
          _id: prestamo.id || prestamo._id,
          libro: prestamo.libro?.titulo || "Libro sin título",
          portada: prestamo.libro?.imagenURL || "/images/librodefault.png",
          usuario: prestamo.usuario?.nombre || userName,
          fechaPrestamo: prestamo.fechaPrestamo,
          fechaDevolucionEstimada: prestamo.fechaDevolucionEstimada,
          fechaDevolucionReal: prestamo.fechaDevolucionReal,
          estado: prestamo.estado // Pasamos el estado original sin modificar
        }));
      }
      return [];
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
      return [];
    }
  }, [user, userName]);

  // =============================
  // Cargar toda la actividad
  // =============================
  const cargarActividad = useCallback(async () => {
    if (!user) return;
    
    setCargandoActividad(true);
    try {
      // Cargar en paralelo para mejor rendimiento
      const [reservas, prestamos] = await Promise.all([
        cargarMisReservas(),
        cargarMisPrestamos()
      ]);
      
      setListaReservas(reservas);
      setListaPrestamos(prestamos);
      
    } catch (error) {
      console.error("Error al cargar actividad:", error);
    } finally {
      setCargandoActividad(false);
    }
  }, [user, cargarMisReservas, cargarMisPrestamos]);

  // =============================
  // Cargar datos al iniciar
  // =============================
  useEffect(() => {
    if (user) {
      cargarActividad();
    }
  }, [user, cargarActividad]);

  // =============================
  // Cargar libros y categorías
  // =============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [librosRes, categoriasRes] = await Promise.all([
          getLibros(),
          getAllCategorias(),
        ]);

        const librosNormalizados = (librosRes.data || librosRes || []).map(
          (libro) => {
            const ejemplaresDisponibles =
              libro.ejemplares?.filter(
                (e) => (e.estado || "").toLowerCase() === "disponible"
              ).length || 0;

            return {
              ...libro,
              portada:
                libro.imagenURL ||
                "/images/librodefault.png",
              disponibles: ejemplaresDisponibles,
              disponible: ejemplaresDisponibles > 0,
              categoria: {
                _id: libro.categoria?._id || "",
                descripcion: libro.categoria?.descripcion || "Sin categoría",
              },
            };
          }
        );

        setListaLibros(librosNormalizados);
        setCategorias(categoriasRes.data || categoriasRes || []);
      } catch (error) {
        console.error(error);
        setToast({
          show: true,
          message: "Error al cargar el catálogo",
          type: "error",
        });
      }
    };

    cargarDatos();
  }, []);

  // =============================
  // Filtros dinámicos
  // =============================
  const autoresUnicos = useMemo(
    () => [...new Set(listaLibros.map((l) => l.autor).filter(Boolean))],
    [listaLibros]
  );

  const editorialesUnicas = useMemo(
    () => [...new Set(listaLibros.map((l) => l.editorial).filter(Boolean))],
    [listaLibros]
  );
  // =============================
// Recalcular disponibilidad real (restando reservas vigentes)
// =============================
const librosConDisponibilidadReal = useMemo(() => {
  return listaLibros.map((libro) => {
    const reservasActivasLibro = listaReservas.filter(
      (r) =>
        r.libroId === libro._id &&
        esReservaVigente(r)
    ).length;

    const disponiblesReales = Math.max(
      libro.disponibles - reservasActivasLibro,
      0
    );

    return {
      ...libro,
      disponibles: disponiblesReales,
      disponible: disponiblesReales > 0,
    };
  });
}, [listaLibros, listaReservas, esReservaVigente]);


  const librosFiltrados = useMemo(() => {
    return librosConDisponibilidadReal.filter((libro) => {
      const coincideBusqueda =
        !busquedaDebounced ||
        libro.titulo?.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
        libro.autor?.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
        libro.editorial
          ?.toLowerCase()
          .includes(busquedaDebounced.toLowerCase());

      const coincideCategoria =
        !filtros.categoria || libro.categoria?._id === filtros.categoria;
      const coincideAutor = !filtros.autor || libro.autor === filtros.autor;
      const coincideEditorial =
        !filtros.editorial || libro.editorial === filtros.editorial;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideAutor &&
        coincideEditorial
      );
    });
 }, [librosConDisponibilidadReal, busquedaDebounced, filtros]);


  // =============================
  // Reservas - Confirmar reserva
  // =============================
  const handleReservar = useCallback((libro) => {
    setLibroAReservar(libro);
    setShowReservaModal(true);
  }, []);

  const confirmarReserva = useCallback(async () => {
    if (!libroAReservar || libroAReservar.disponibles <= 0) return;

    try {
      if (!user) throw new Error("Usuario no autenticado");

      const usuarioId = getUserId();
      //Validar ANTES de llamar al servicio
      if (!usuarioId) {
        setToast({
          show: true,
          message: "Error de autenticación: Usuario no identificado",
          type: "error",
        });
        return; // Salir de la función
      }

      const fechaExpiracion = new Date();
      fechaExpiracion.setDate(fechaExpiracion.getDate() + 3);

      await reservarLibro(
        libroAReservar._id,
        fechaExpiracion.toISOString(),
        "estudiante",
        usuarioId
      );

      // Recargar toda la actividad después de reservar
      await cargarActividad();

      setShowReservaModal(false);
      setLibroAReservar(null);

      setToast({
        show: true,
        message: `Reserva realizada de "${libroAReservar.titulo}"`,
        type: "success",
      });

    } catch (error) {
      console.error("Error en reserva:", error);
      setToast({
        show: true,
        message: error.response?.data?.message || "❌ Error al crear la reserva",
        type: "error",
      });
    }
  }, [libroAReservar, user, getUserId, cargarActividad]);

  // =============================
  // Toast auto close
  // =============================
  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      4000
    );
    return () => clearTimeout(t);
  }, [toast.show]);

  if (loading || !user) return null;

  const limpiarFiltros = () =>
    setFiltros({ categoria: "", autor: "", editorial: "" });

  const filtrosActivos = Object.values(filtros).filter(Boolean).length;
  
  return (
    <>
      <Menu activeView={vistaActual} onViewChange={setVistaActual} />

      <main className={styles.mainContent}>
        <div className="container">
          {vistaActual === "catalogo" ? (
            <>
              <SearchBar
                searchValue={busquedaInmediata}
                onSearchChange={setBusquedaInmediata}
                onToggleFilters={() => setShowFiltros(!showFiltros)}
                showFilters={showFiltros}
                activeFiltersCount={filtrosActivos}
              />

              {showFiltros && (
                <Filters
                  filters={filtros}
                  onFilterChange={(f) =>
                    setFiltros((prev) => ({ ...prev, ...f }))
                  }
                  onClearFilters={limpiarFiltros}
                  categories={categorias}
                  uniqueAuthors={autoresUnicos}
                  uniquePublishers={editorialesUnicas}
                  activeFiltersCount={filtrosActivos}
                  filteredBooksCount={librosFiltrados.length}
                  totalBooksCount={listaLibros.length}
                />
              )}

              <div className="row justify-content-center g-2 g-lg-3">
                {librosFiltrados.length > 0 ? (
                  librosFiltrados.map((libro) => (
                    <BookCard
                      key={libro._id}
                      libro={libro}
                      onReserve={handleReservar}
                    />
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <h3>No se encontraron libros</h3>
                    <p>Intenta ajustar los filtros</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {cargandoActividad ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando tu actividad...</span>
                  </div>
                  <p className="mt-2">Cargando tu actividad...</p>
                </div>
              ) : (
                <ActivityItems
                  prestamos={listaPrestamos}
                  reservas={listaReservas}
                />
              )}
            </>
          )}
        </div>
      </main>

      <ReservationModal
        show={showReservaModal}
        libro={libroAReservar}
        onClose={() => {
            setShowReservaModal(false);
            setLibroAReservar(null); //Limpiar también el libro seleccionado
        }}
        onConfirm={confirmarReserva}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
      />
    </>
  );
}