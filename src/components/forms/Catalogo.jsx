"use client";
import React, { useState, useMemo, useCallback, useRef } from "react";
import styles from "../../styles/catalogo.module.css";
import global from "../../styles/Global.module.css";
import { useAuth } from "@/contexts/AuthContext";
import EditarLibro from "./EditarLibro";
import AgregarLibro from "./AgregarLibro";

// Importar componentes UI
import AppHeader from "../ui/AppHeader";
import PageTitle from "../ui/PageTitle";
import CatalogoBarra from "../ui/CatalogoBarra";
import CatalogoFilters from "../ui/CatalogoFilters";
import CatalogoBookCard from "../ui/CatalogoBookCard";
import CatalogoEmptyState from "../ui/CatalogoEmptyState";
import CatalogoEliminarModal from "../ui/CatalogoEliminarModal";
import { useDebounce } from "../../hooks/useDebounce";

// Datos estáticos
const categorias = [
  { _id: "1", descripcion: "Literatura" },
  { _id: "2", descripcion: "Ciencia" },
  { _id: "3", descripcion: "Tecnología" },
  { _id: "4", descripcion: "Historia" },
  { _id: "5", descripcion: "Filosofía" },
];

const librosIniciales = [
  {
      id: 1,
      titulo: "Don Quijote de la Mancha",
      autor: "Miguel de Cervantes Saavedra",
      editorial: "Signet Classics",
      ejemplares: [
        { id: 1, estado: "disponible" },
        { id: 2, estado: "disponible" },
        { id: 3, estado: "prestado" }
      ],
      portada: "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780451525079",
      categoriaId: "1",
      donado: false,
      origen: null,
      precio: 25.99
    },
    {
      id: 2,
      titulo: "Un día en la vida",
      autor: "Manlio Argueta",
      editorial: "UCA",
      ejemplares: [
        { id: 4, estado: "disponible" },
        { id: 5, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=qg9fAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780394722160",
      categoriaId: "2",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 3,
      titulo: "Vecinas",
      autor: "Santiago Nogales",
      editorial: "Loqueleo Santillana",
      ejemplares: [
        { id: 6, estado: "disponible" },
        { id: 7, estado: "prestado" },
        { id: 8, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=Rtk8PgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9788467591735",
      categoriaId: "3",
      donado: false,
      origen: null,
      precio: 22.75
    },
    {
      id: 4,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 5,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 6,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 7,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    }
];

export default function Catalogo({ volverMenu }) {
  const { logout } = useAuth();

  // Estados principales
  const [libros, setLibros] = useState(librosIniciales);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [mostrarEditarLibro, setMostrarEditarLibro] = useState(false);
  const [libroAEditar, setLibroAEditar] = useState(null);
  const [mostrarAgregarLibro, setMostrarAgregarLibro] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados separados para búsqueda con debouncing
  const [busquedaInmediata, setBusquedaInmediata] = useState("");
  const [otrosFiltros, setOtrosFiltros] = useState({
    autor: "",
    editorial: "",
    categoria: "",
    tipo: "",
    ejemplaresMin: "",
    ejemplaresMax: ""
  });

  // Debouncing para la búsqueda (300ms)
  const busquedaDebounced = useDebounce(busquedaInmediata, 300);

  // Combinar filtros después del debouncing
  const filtros = useMemo(() => ({
    busqueda: busquedaDebounced,
    ...otrosFiltros
  }), [busquedaDebounced, otrosFiltros]);

  // Función para contar total de ejemplares
  const contarTotalEjemplares = useCallback((ejemplares) => {
    return ejemplares.length;
  }, []);

  // Handlers memoizados
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error durante logout:", error);
    }
  }, [logout]);

  const handleEditar = useCallback((libro) => {
    setLibroAEditar(libro);
    setMostrarEditarLibro(true);
  }, []);

  const handleVolverCatalogo = useCallback(() => {
    setMostrarEditarLibro(false);
    setLibroAEditar(null);
    setMostrarAgregarLibro(false);
  }, []);

  const handleAgregarLibro = useCallback(() => {
    setMostrarAgregarLibro(true);
  }, []);

  // Handler optimizado para búsqueda
  const handleBusquedaChange = useCallback((valor) => {
    setBusquedaInmediata(valor);
  }, []);

  // Handler optimizado para otros filtros
  const handleFiltroChange = useCallback((campo, valor) => {
    setOtrosFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setBusquedaInmediata("");
    setOtrosFiltros({
      autor: "",
      editorial: "",
      categoria: "",
      tipo: "",
      ejemplaresMin: "",
      ejemplaresMax: ""
    });
  }, []);

  const handleEliminarLibro = useCallback((libro) => {
    setLibroAEliminar(libro);
    setShowDeleteModal(true);
  }, []);

  const confirmarEliminar = useCallback(() => {
    setLibros(prev => prev.filter((l) => l.id !== libroAEliminar.id));
    setLibroAEliminar(null);
    setShowDeleteModal(false);
  }, [libroAEliminar]);

  const handleToggleFilters = useCallback(() => {
    setMostrarFiltros(prev => !prev);
  }, []);

  // Cálculos memoizados para optimización
  const autoresUnicos = useMemo(() => 
    [...new Set(libros.map(libro => libro.autor))], 
    [libros]
  );

  const editorialesUnicas = useMemo(() => 
    [...new Set(libros.map(libro => libro.editorial))], 
    [libros]
  );

  const filtrosActivos = useMemo(() => 
    Object.values(filtros).filter(valor => 
      valor !== "" && valor !== null && valor !== undefined
    ).length, 
    [filtros]
  );

  // Filtrado de libros memoizado y optimizado
  const librosFiltrados = useMemo(() => {
    const normalize = (txt) =>
      txt?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    return libros.filter((libro) => {
      // Solo aplicar filtro de búsqueda si hay texto
      if (filtros.busqueda) {
        const textoBusqueda = normalize(filtros.busqueda);
        if (!normalize(libro.titulo).includes(textoBusqueda) &&
            !normalize(libro.autor).includes(textoBusqueda) &&
            !normalize(libro.editorial).includes(textoBusqueda)) {
          return false;
        }
      }

      // Aplicar otros filtros solo si están activos
      if (filtros.autor && normalize(libro.autor) !== normalize(filtros.autor)) {
        return false;
      }

      if (filtros.editorial && normalize(libro.editorial) !== normalize(filtros.editorial)) {
        return false;
      }

      if (filtros.categoria && libro.categoriaId !== filtros.categoria) {
        return false;
      }

      if (filtros.tipo) {
        const esDonado = filtros.tipo === "donado";
        if (libro.donado !== esDonado) {
          return false;
        }
      }

      const totalEjemplares = contarTotalEjemplares(libro.ejemplares);
      
      if (filtros.ejemplaresMin) {
        const ejemplaresMin = parseInt(filtros.ejemplaresMin);
        if (totalEjemplares < ejemplaresMin) {
          return false;
        }
      }

      if (filtros.ejemplaresMax) {
        const ejemplaresMax = parseInt(filtros.ejemplaresMax);
        if (totalEjemplares > ejemplaresMax) {
          return false;
        }
      }

      return true;
    });
  }, [libros, filtros, contarTotalEjemplares]);

  // Renderizado condicional
  if (mostrarAgregarLibro) return <AgregarLibro volverCatalogo={handleVolverCatalogo} />;
  if (mostrarEditarLibro && libroAEditar) return <EditarLibro volverCatalogo={handleVolverCatalogo} libro={libroAEditar} />;

  return (
    <div className={global.backgroundWrapper}>
      <AppHeader onHomeClick={volverMenu} onLogoutClick={handleLogout} />

      <PageTitle title="Catálogo" />

      <div className="mb-4"></div>

      <div className="container">
        <div className={styles.containerLimit}>
          <CatalogoBarra
            searchValue={busquedaInmediata}
            onSearchChange={handleBusquedaChange}
            onToggleFilters={handleToggleFilters}
            showFilters={mostrarFiltros}
            activeFiltersCount={filtrosActivos}
            onAddBook={handleAgregarLibro}
          />

          {mostrarFiltros && (
            <CatalogoFilters
              filters={filtros}
              onFilterChange={handleFiltroChange}
              onClearFilters={limpiarFiltros}
              categories={categorias}
              uniqueAuthors={autoresUnicos}
              uniquePublishers={editorialesUnicas}
              filteredBooksCount={librosFiltrados.length}
              totalBooksCount={libros.length}
              activeFiltersCount={filtrosActivos}
            />
          )}
        </div>

        <div className="row justify-content-center g-2 g-lg-3">
          {librosFiltrados.map((libro) => {
            const categoria = categorias.find(cat => cat._id === libro.categoriaId);
            return (
              <CatalogoBookCard
                key={libro.id}
                libro={libro}
                categoria={categoria}
                onEdit={handleEditar}
                onDelete={handleEliminarLibro}
                contarTotalEjemplares={contarTotalEjemplares}
              />
            );
          })}
        </div>

        {librosFiltrados.length === 0 && (
          <CatalogoEmptyState
            hasActiveFilters={filtrosActivos > 0}
            onClearFilters={limpiarFiltros}
          />
        )}
      </div>

      <CatalogoEliminarModal
        show={showDeleteModal}
        libro={libroAEliminar}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmarEliminar}
        contarTotalEjemplares={contarTotalEjemplares}
      />
    </div>
  );
}