"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/IntEstudiantes.module.css";
import { reservarLibro } from "@/services/prestamoService";


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

export default function InterfazEstudiantes() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Estados principales
  const [vistaActual, setVistaActual] = useState("catalogo");
  const [listaLibros, setListaLibros] = useState([]);
  const [listaPrestamos, setListaPrestamos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [showReservaModal, setShowReservaModal] = useState(false);
  const [libroAReservar, setLibroAReservar] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);

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
  // 👤 Nombre usuario
  // =============================
  const userName = useMemo(() => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "Usuario";
  }, [user]);
  useEffect(() => {
  console.log("USUARIO LOGUEADO COMPLETO:", user);
}, [user]);


  // =============================
  // 📡 Cargar libros y categorías
  // =============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [librosRes, categoriasRes] = await Promise.all([
          getLibros(),
          getAllCategorias(),
        ]);

        // Normalizar libros
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
                "https://via.placeholder.com/150x200?text=Sin+Portada",
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
  // 📚 Filtros dinámicos
  // =============================
  const autoresUnicos = useMemo(
    () => [...new Set(listaLibros.map((l) => l.autor).filter(Boolean))],
    [listaLibros]
  );

  const editorialesUnicas = useMemo(
    () => [...new Set(listaLibros.map((l) => l.editorial).filter(Boolean))],
    [listaLibros]
  );

  const librosFiltrados = useMemo(() => {
    return listaLibros.filter((libro) => {
      const coincideBusqueda =
        !busquedaDebounced ||
        libro.titulo?.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
        libro.autor?.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
        libro.editorial
          ?.toLowerCase()
          .includes(busquedaDebounced.toLowerCase());

      const coincideCategoria =
        !filtros.categoria || libro.categoria._id === filtros.categoria;
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
  }, [listaLibros, busquedaDebounced, filtros]);

  // =============================
  // 📌 Reservas (UI)
  // =============================
  const handleReservar = useCallback((libro) => {
    setLibroAReservar(libro);
    setShowReservaModal(true);
  }, []);

  const confirmarReserva = useCallback(async () => {
  if (!libroAReservar || libroAReservar.disponibles <= 0) return;

  try {

    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    // 🔥 IMPORTANTE: Detectar el id real
    const usuarioId =
      user._id || user.id || user.sub;

    console.log("USUARIO ID ENVIADO:", usuarioId);

    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 3);

    await reservarLibro(
      libroAReservar._id,
      fechaExpiracion.toISOString(),
      "estudiante",
      usuarioId // 🔥 ahora sí lo enviamos
    );

    const nuevaReserva = {
      _id: Date.now().toString(),
      estado: "reservado",
      fechaReserva: new Date().toISOString().split("T")[0],
      libro: libroAReservar.titulo,
      portada: libroAReservar.portada,
      usuario: userName,
    };

    setListaPrestamos((prev) => [...prev, nuevaReserva]);

    setShowReservaModal(false);
    setLibroAReservar(null);

    setToast({
      show: true,
      message: `Reserva realizada de "${libroAReservar.titulo}"`,
      type: "success",
    });

  } catch (error) {
    console.error(error);

    setToast({
      show: true,
      message: "Error al crear la reserva",
      type: "error",
    });
  }
}, [libroAReservar, user, userName]);



    
  // =============================
  // 🧹 Toast auto close
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

  const reservasActivas = listaPrestamos.filter((p) => p.estado === "reservado");
  const prestamosActivos = listaPrestamos.filter((p) => p.estado !== "reservado");

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
            <ActivityItems
              prestamos={prestamosActivos}
              reservas={reservasActivas}
            />
          )}
        </div>
      </main>

      <ReservationModal
        show={showReservaModal}
        libro={libroAReservar}
        onClose={() => setShowReservaModal(false)}
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
