"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "@/styles/catalogo.module.css";
import global from "@/styles/Global.module.css";
import { AppHeader, PageTitle } from "@/components/ui";
import {
  CatalogoBarra,
  CatalogoFilters,
  CatalogoBookCard,
  CatalogoEmptyState,
  CatalogoEliminarModal,
} from "@/components/ui/catalogo";

// Datos estáticos 
const categorias = [
  { _id: "1", descripcion: "Literatura" },
  { _id: "2", descripcion: "Ciencia" },
  { _id: "3", descripcion: "Tecnología" },
  { _id: "4", descripcion: "Historia" },
  { _id: "5", descripcion: "Filosofía" },
];

const libros = [
  {
    id: 1,
    titulo: "Don Quijote de la Manchachita",
    autor: "Miguel de Cervantes Saavedra",
    editorial: "Signet Classics",
    ejemplares: [
      {
        id: 1,
        codigo: "DQ-001",
        ubicacion: "Estante A-1",
        edificio: "1",
        estado: "Disponible",
        donado: false,
        origen: null,
        precio: 25.99,
      },
      {
        id: 2,
        codigo: "DQ-002",
        ubicacion: "Estante A-2",
        edificio: "1",
        estado: "Disponible",
        donado: false,
        origen: null,
        precio: 25.99,
      },
      {
        id: 3,
        codigo: "DQ-003",
        ubicacion: "Estante A-3",
        edificio: "1",
        estado: "Prestado",
        donado: true,
        origen: "Fundación Arrupe",
        precio: null,
      },
    ],
    portada:
      "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780451525079",
    categoriaId: "1",
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
        donado: true,
        origen: "Fundación Arrupe",
        precio: null,
      },
      {
        id: 5,
        codigo: "UDV-002",
        ubicacion: "Estante B-2",
        edificio: "2",
        estado: "Disponible",
        donado: true,
        origen: "Fundación Arrupe",
        precio: null,
      },
    ],
    portada:
      "http://books.google.com/books/content?id=qg9fAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780394722160",
    categoriaId: "2",
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
        donado: false,
        origen: null,
        precio: 22.75,
      },
      {
        id: 7,
        codigo: "VEC-002",
        ubicacion: "Estante C-2",
        edificio: "1",
        estado: "Prestado",
        donado: false,
        origen: null,
        precio: 22.75,
      },
      {
        id: 8,
        codigo: "VEC-003",
        ubicacion: "Estante C-3",
        edificio: "1",
        estado: "Disponible",
        donado: true,
        origen: "Héctor Martínez",
        precio: null,
      },
    ],
    portada:
      "http://books.google.com/books/content?id=Rtk8PgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9788467591735",
    categoriaId: "3",
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
        estado: "Disponible",
        donado: true,
        origen: "Fundación Arrupe",
        precio: null,
      },
      {
        id: 10,
        codigo: "100AS-002",
        ubicacion: "Estante D-2",
        edificio: "3",
        estado: "Disponible",
        donado: true,
        origen: "Fundación Arrupe",
        precio: null,
      },
      {
        id: 11,
        codigo: "100AS-003",
        ubicacion: "Estante D-3",
        edificio: "3",
        estado: "Disponible",
        donado: true,
        origen: "Fundación Arrupe",
        precio: null,
      },
    ],
    portada:
      "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780380015030",
    categoriaId: "4",
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
        donado: false,
        origen: null,
        precio: 28.5,
      },
      {
        id: 13,
        codigo: "CAS-002",
        ubicacion: "Estante E-2",
        edificio: "2",
        estado: "Reservado",
        donado: true,
        origen: "Héctor Martínez",
        precio: null,
      },
    ],
    portada:
      "https://www.rae.es/sites/default/files/portada_cien_anos_de_soledad_0.jpg",
    isbn: "9780141032484",
    categoriaId: "4",
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
        donado: true,
        origen: "Donación particular",
        precio: null,
      },
      {
        id: 15,
        codigo: "EP-002",
        ubicacion: "Estante F-2",
        edificio: "1",
        estado: "Perdido",
        donado: true,
        origen: "Donación particular",
        precio: null,
      },
    ],
    portada:
      "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780156013987",
    categoriaId: "1",
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
        donado: false,
        origen: null,
        precio: 19.99,
      },
      {
        id: 17,
        codigo: "1984-002",
        ubicacion: "Estante G-2",
        edificio: "3",
        estado: "Prestado",
        donado: false,
        origen: null,
        precio: 19.99,
      },
      {
        id: 18,
        codigo: "1984-003",
        ubicacion: "Estante G-3",
        edificio: "3",
        estado: "Disponible",
        donado: false,
        origen: null,
        precio: 19.99,
      },
    ],
    portada:
      "http://books.google.com/books/content?id=Y-HzPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    isbn: "9780451524935",
    categoriaId: "5",
  },
  {
    id: 8,
    titulo: "Una prueba más",
    autor: "Anónimo",
    editorial: "Ninguna",
    ejemplares: [
      {
        id: 16,
        codigo: "1984-001",
        ubicacion: "Estante G-1",
        edificio: "3",
        estado: "Disponible",
        donado: false,
        origen: null,
        precio: 19.99,
      },
    ],
    portada:
      "https://cdn.creazilla.com/emojis/52888/closed-book-emoji-clipart-md.png",
    isbn: "9780451524935",
    categoriaId: "5",
  },
];


export default function CatalogoPage() {
  const router = useRouter();

  // Estados principales
  const [Libros, setLibros] = useState(libros);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Estados separados para búsqueda con debouncing
  const [busquedaInmediata, setBusquedaInmediata] = useState("");
  const [otrosFiltros, setOtrosFiltros] = useState({
    autor: "",
    editorial: "",
    categoria: "",
    tipo: "",
    ejemplaresMin: "",
    ejemplaresMax: "",
  });

  // Debouncing para la búsqueda (300ms)
  const busquedaDebounced = useDebounce(busquedaInmediata, 300);

  // Combinar filtros después del debouncing
  const filtros = useMemo(
    () => ({
      busqueda: busquedaDebounced,
      ...otrosFiltros,
    }),
    [busquedaDebounced, otrosFiltros]
  );

  // Función para contar total de ejemplares
  const contarTotalEjemplares = useCallback((ejemplares) => {
    return ejemplares ? ejemplares.length : 0;
  }, []);

  // Handler para editar usando router.push
  const handleEditar = useCallback((libro) => {
    console.log('Editando libro ID:', libro.id);
    if (libro && libro.id) {
      router.push(`/dashboard/catalogo/editar/${libro.id}`);
    } else {
      console.error('Libro o ID no válido:', libro);
    }
  }, [router]);

  // Handler para agregar usando router.push
  const handleAgregarLibro = useCallback(() => {
    console.log('Navegando a agregar libro');
    router.push('/dashboard/catalogo/agregar');
  }, [router]);

  // Handler optimizado para búsqueda
  const handleBusquedaChange = useCallback((valor) => {
    setBusquedaInmediata(valor);
  }, []);

  // Handler optimizado para otros filtros
  const handleFiltroChange = useCallback((campo, valor) => {
    setOtrosFiltros((prev) => ({
      ...prev,
      [campo]: valor,
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
      ejemplaresMax: "",
    });
  }, []);

  const handleEliminarLibro = useCallback((libro) => {
    setLibroAEliminar(libro);
    setShowDeleteModal(true);
  }, []);

  const confirmarEliminar = useCallback(() => {
    setLibros((prev) => prev.filter((l) => l.id !== libroAEliminar.id));
    setLibroAEliminar(null);
    setShowDeleteModal(false);
  }, [libroAEliminar]);

  const handleToggleFilters = useCallback(() => {
    setMostrarFiltros((prev) => !prev);
  }, []);

  // Cálculos memoizados para optimización
  const autoresUnicos = useMemo(
    () => [...new Set(Libros.map((libro) => libro.autor))],
    [Libros]
  );

  const editorialesUnicas = useMemo(
    () => [...new Set(Libros.map((libro) => libro.editorial))],
    [Libros]
  );

  const filtrosActivos = useMemo(
    () =>
      Object.values(filtros).filter(
        (valor) => valor !== "" && valor !== null && valor !== undefined
      ).length,
    [filtros]
  );

  // Filtrado de Libros memoizado y optimizado
  const librosFiltrados = useMemo(() => {
    const normalize = (txt) =>
      txt
        ?.toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || "";

    return Libros.filter((libro) => {
      // Solo aplicar filtro de búsqueda si hay texto
      if (filtros.busqueda) {
        const textoBusqueda = normalize(filtros.busqueda);
        if (
          !normalize(libro.titulo).includes(textoBusqueda) &&
          !normalize(libro.autor).includes(textoBusqueda) &&
          !normalize(libro.editorial).includes(textoBusqueda)
        ) {
          return false;
        }
      }

      // Aplicar otros filtros solo si están activos
      if (
        filtros.autor &&
        normalize(libro.autor) !== normalize(filtros.autor)
      ) {
        return false;
      }

      if (
        filtros.editorial &&
        normalize(libro.editorial) !== normalize(filtros.editorial)
      ) {
        return false;
      }

      if (filtros.categoria && libro.categoriaId !== filtros.categoria) {
        return false;
      }

      if (filtros.tipo) {
        const esDonado = libro.ejemplares?.some(ej => ej.donado === true) || false;
        if (filtros.tipo === "donado" && !esDonado) {
          return false;
        }
        if (filtros.tipo === "comprado" && esDonado) {
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
  }, [Libros, filtros, contarTotalEjemplares]);

  return (
    <div className={global.backgroundWrapper}>
      <AppHeader />

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
              totalBooksCount={Libros.length}
              activeFiltersCount={filtrosActivos}
            />
          )}
        </div>

        <div className="row justify-content-center g-2 g-lg-3">
          {librosFiltrados.map((libro) => {
            const categoria = categorias.find(
              (cat) => cat._id === libro.categoriaId
            );
            return (
              <CatalogoBookCard
                key={libro.id}
                libro={libro}
                categoria={categoria}
                onEdit={() => handleEditar(libro)}
                onDelete={() => handleEliminarLibro(libro)}
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