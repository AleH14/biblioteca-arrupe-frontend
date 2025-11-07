"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "../../styles/IntEstudiantes.module.css";
import global from "../../styles/Global.module.css";

// Componentes UI
import AppHeader from "../ui/intestudiantes/AppHeaderEstudiante";
import PageTitle from "../ui/PageTitle";
import Menu from "../ui/intestudiantes/MenuEstudiante";
import SearchBar from "../ui/intestudiantes/SearchBarEstudiante";
import Filters from "../ui/intestudiantes/FiltersEstudiante";
import BookCard from "../ui/intestudiantes/BookCardEstudiante";
import ActivityItems from "../ui/intestudiantes/ActivityItemsEstudiante";
import ReservationModal from "../ui/intestudiantes/ReservationModal";
import Toast from "../ui/Toast";

// Hook personalizado
import { useDebounce } from "../../hooks/useDebounce";

// 📚 Categorías simuladas
const categorias = [
  { _id: "1", descripcion: "Literatura" },
  { _id: "2", descripcion: "Ciencia" },
  { _id: "3", descripcion: "Tecnología" },
  { _id: "4", descripcion: "Historia" },
  { _id: "5", descripcion: "Filosofía" },
];

// Libros simulados
const libros = [
  {
    id: 1,
    titulo: "Don Quijote de la Manchachita",
    autor: "Miguel de Cervantes Saavedra",
    editorial: "Signet Classics",
    ejemplares: [],
    portada:
      "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780451525079",
    categoriaId: "1",
    donado: false,
    origen: null,
    precio: 25.99,
  },
  {
    id: 2,
    titulo: "Un día en la vida",
    autor: "Manlio Argueta",
    editorial: "UCA",
    ejemplares: [
      {
        id: 4,
        codigo: "UDV-001",
        ubicacion: "Estante B-1",
        edificio: "2",
        estado: "Disponible",
      },
      {
        id: 5,
        codigo: "UDV-002",
        ubicacion: "Estante B-2",
        edificio: "2",
        estado: "Disponible",
      },
    ],
    portada:
      "http://books.google.com/books/content?id=qg9fAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780394722160",
    categoriaId: "2",
    donado: true,
    origen: "Fundación Arrupe",
    precio: null,
  },
  {
    id: 3,
    titulo: "Vecinas",
    autor: "Santiago Nogales",
    editorial: "Loqueleo Santillana",
    ejemplares: [
      {
        id: 6,
        codigo: "VEC-001",
        ubicacion: "Estante C-1",
        edificio: "1",
        estado: "Disponible",
      },
      {
        id: 7,
        codigo: "VEC-002",
        ubicacion: "Estante C-2",
        edificio: "1",
        estado: "Prestado",
      },
      {
        id: 8,
        codigo: "VEC-003",
        ubicacion: "Estante C-3",
        edificio: "1",
        estado: "Disponible",
      },
    ],
    portada:
      "http://books.google.com/books/content?id=Rtk8PgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9788467591735",
    categoriaId: "3",
    donado: false,
    origen: null,
    precio: 22.75,
  },
  {
    id: 4,
    titulo: "100 Años de Soledad",
    autor: "Gabriel García Márquez",
    editorial: "Harper",
    ejemplares: [
      {
        id: 9,
        codigo: "100AS-001",
        ubicacion: "Estante D-1",
        edificio: "3",
        estado: "Prestado",
      },
      {
        id: 10,
        codigo: "100AS-002",
        ubicacion: "Estante D-2",
        edificio: "3",
        estado: "Prestado",
      },
      {
        id: 11,
        codigo: "100AS-003",
        ubicacion: "Estante D-3",
        edificio: "3",
        estado: "Reservado",
      },
    ],
    portada:
      "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780380015030",
    categoriaId: "4",
    donado: true,
    origen: "Fundación Arrupe",
    precio: null,
  },
  {
    id: 5,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    editorial: "Penguin",
    ejemplares: [
      {
        id: 12,
        codigo: "CAS-001",
        ubicacion: "Estante E-1",
        edificio: "2",
        estado: "Disponible",
      },
      {
        id: 13,
        codigo: "CAS-002",
        ubicacion: "Estante E-2",
        edificio: "2",
        estado: "Reservado",
      },
    ],
    portada:
      "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780141032484",
    categoriaId: "4",
    donado: false,
    origen: null,
    precio: 28.5,
  },
  {
    id: 6,
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    editorial: "Harcourt",
    ejemplares: [
      {
        id: 14,
        codigo: "EP-001",
        ubicacion: "Estante F-1",
        edificio: "1",
        estado: "Disponible",
      },
      {
        id: 15,
        codigo: "EP-002",
        ubicacion: "Estante F-2",
        edificio: "1",
        estado: "Perdido",
      },
    ],
    portada:
      "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780156013987",
    categoriaId: "1",
    donado: true,
    origen: "Donación particular",
    precio: null,
  },
  {
    id: 7,
    titulo: "1984",
    autor: "George Orwell",
    editorial: "Secker & Warburg",
    ejemplares: [
      {
        id: 16,
        codigo: "1984-001",
        ubicacion: "Estante G-1",
        edificio: "3",
        estado: "Disponible",
      },
      {
        id: 17,
        codigo: "1984-002",
        ubicacion: "Estante G-2",
        edificio: "3",
        estado: "Prestado",
      },
      {
        id: 18,
        codigo: "1984-003",
        ubicacion: "Estante G-3",
        edificio: "3",
        estado: "Disponible",
      },
    ],
    portada:
      "http://books.google.com/books/content?id=Y-HzPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780451524935",
    categoriaId: "5",
    donado: false,
    origen: null,
    precio: 19.99,
  },
];

// Préstamos simulados
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
    portada:
      "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
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
    portada:
      "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
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
    portada:
      "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
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
    libro: "El Principito",
    portada:
      "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
  },
];

export default function InterfazEstudiantes({ volverMenu }) {
  const { user, logout } = useAuth();

  const [vistaActual, setVistaActual] = useState("catalogo");
  const [listaLibros, setListaLibros] = useState(libros);
  const [listaPrestamos, setListaPrestamos] = useState(prestamos);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [libroAReservar, setLibroAReservar] = useState(null);
  const [showFiltros, setShowFiltros] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Usuario logueado
  const userName = useMemo(() => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "Usuario";
  }, [user]);

  // Búsqueda y filtros
  const [busquedaInmediata, setBusquedaInmediata] = useState("");
  const [filtros, setFiltros] = useState({
    categoria: "",
    autor: "",
    editorial: "",
  });
  const busquedaDebounced = useDebounce(busquedaInmediata, 300);

  // Crear variable para pasar a Filters
  const categoriasEstudiante = categorias;

  // Autores únicos
  const autoresUnicos = useMemo(
    () => [...new Set(libros.map((libro) => libro.autor))],
    [libros]
  );

  // Editoriales únicas
  const editorialesUnicas = useMemo(
    () => [...new Set(libros.map((libro) => libro.editorial))],
    [libros]
  );

  // Filtrado de libros CORREGIDO - incluye todos los filtros
  const librosFiltrados = useMemo(() => {
    return listaLibros.filter((libro) => {
      // Filtro de búsqueda
      const coincideBusqueda =
        !busquedaDebounced ||
        libro.titulo.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
        libro.autor.toLowerCase().includes(busquedaDebounced.toLowerCase()) ||
        libro.editorial.toLowerCase().includes(busquedaDebounced.toLowerCase());

      // Filtro de categoría
      const coincideCategoria =
        !filtros.categoria || libro.categoriaId === filtros.categoria;

      // Filtro de autor
      const coincideAutor = !filtros.autor || libro.autor === filtros.autor;

      // Filtro de editorial
      const coincideEditorial =
        !filtros.editorial || libro.editorial === filtros.editorial;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideAutor &&
        coincideEditorial
      );
    });
  }, [
    listaLibros,
    busquedaDebounced,
    filtros.categoria,
    filtros.autor,
    filtros.editorial,
  ]);

  // Calcular disponibilidad para cada libro
  const librosConDisponibilidad = useMemo(() => {
    return librosFiltrados.map((libro) => {
      const disponibles = libro.ejemplares
        ? libro.ejemplares.filter((ej) => ej.estado === "Disponible").length
        : 0;
      return {
        ...libro,
        disponibles,
        disponible: disponibles > 0,
      };
    });
  }, [librosFiltrados]);

  const handleFiltroChange = (nuevoFiltro) => {
    setFiltros((prevFiltros) => ({ ...prevFiltros, ...nuevoFiltro }));
  };

  const limpiarFiltros = () => {
    setFiltros({ categoria: "", autor: "", editorial: "" });
  };

  // Contar cuántos filtros están activos
  const filtrosActivos = Object.entries(filtros).filter(
    ([key, valor]) => ["categoria", "autor", "editorial"].includes(key) && valor
  ).length;

  //  Reserva (3 días)
  const handleReservar = useCallback((libro) => {
    setLibroAReservar(libro);
    setShowReservaModal(true);
  }, []);

  const confirmarReserva = useCallback(() => {
    if (!libroAReservar || libroAReservar.disponibles <= 0) return;

    const fechaReserva = new Date();
    const fechaExpiracion = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const nuevaReserva = {
      _id: Date.now().toString(),
      ejemplarId: libroAReservar.id,
      estado: "reservado",
      fechaPrestamo: null,
      fechaDevolucionEstimada: null,
      fechaDevolucionReal: null,
      fechaReserva: fechaReserva.toISOString().split("T")[0],
      fechaExpiracion: fechaExpiracion.toISOString().split("T")[0],
      libro: libroAReservar.titulo,
      portada: libroAReservar.portada,
      usuario: userName,
    };

    setListaPrestamos((prev) => [...prev, nuevaReserva]);
    setShowReservaModal(false);
    setLibroAReservar(null);
    setToast({
      show: true,
      message: `¡Reserva de "${libroAReservar.titulo}" realizada con éxito por 3 días!`,
      type: "success",
    });
  }, [libroAReservar, userName]);

  // Cerrar sesión
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      setToast({
        show: true,
        message: "Error al cerrar sesión",
        type: "error",
      });
    }
  }, [logout]);

  // 📋 Filtrar reservas y préstamos
  const reservasActivas = listaPrestamos.filter(
    (p) => p.estado === "reservado"
  );
  const prestamosActivos = listaPrestamos.filter(
    (p) => p.estado !== "reservado"
  );

  const EmptyState = ({ type }) => (
    <div className={styles.noHistory}>
      <h3>No hay actividad registrada</h3>
      <p>
        {type === "reserva"
          ? "Cuando realices una reserva, aparecerá aquí."
          : "Cuando tomes prestado un libro, aparecerá aquí."}
      </p>
    </div>
  );

  // Efecto para cerrar automáticamente el Toast
  React.useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <div className={global.backgroundWrapper}>
      <AppHeader
        onHomeClick={volverMenu}
        onLogoutClick={handleLogout}
        userName={userName}
      />
      <PageTitle title="Biblioteca Padre Arrupe" />
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
                  onFilterChange={handleFiltroChange}
                  onClearFilters={limpiarFiltros}
                  categories={categoriasEstudiante}
                  uniqueAuthors={autoresUnicos}
                  uniquePublishers={editorialesUnicas}
                  activeFiltersCount={filtrosActivos}
                  filteredBooksCount={librosConDisponibilidad.length}
                  totalBooksCount={libros.length}
                />
              )}

              <div className="row justify-content-center g-2 g-lg-3">
                {librosConDisponibilidad.length > 0 ? (
                  librosConDisponibilidad.map((libro) => (
                    <BookCard
                      key={libro.id}
                      libro={libro}
                      onReserve={handleReservar}
                    />
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <h3>No se encontraron libros</h3>
                    <p>Intenta ajustar los filtros de búsqueda</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {prestamosActivos.length > 0 || reservasActivas.length > 0 ? (
                <ActivityItems
                  prestamos={prestamosActivos}
                  reservas={reservasActivas}
                />
              ) : (
                <EmptyState type="reserva" />
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
          setLibroAReservar(null);
        }}
        onConfirm={confirmarReserva}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: "", type: "success" })}
        duration={null} // Desactiva el timer interno del Toast
      />
    </div>
  );
}
