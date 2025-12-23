"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "@/styles/catalogo.module.css";
import global from "@/styles/Global.module.css";
import AppHeader from "@/components/ui/AppHeader";
import PageTitle from "@/components/ui/PageTitle";
import CatalogoBarra from "@/components/ui/catalogo/CatalogoBarra";
import CatalogoFilters from "@/components/ui/catalogo/CatalogoFilters";
import CatalogoBookCard from "@/components/ui/catalogo/CatalogoBookCard";
import CatalogoEmptyState from "@/components/ui/catalogo/CatalogoEmptyState";
import CatalogoEliminarModal from "@/components/ui/catalogo/CatalogoEliminarModal";
import Toast from "@/components/ui/Toast";
import { LibrosService } from '@/services';

export default function CatalogoPage() {
  const router = useRouter();

  // Estados principales
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteToastMessage, setDeleteToastMessage] = useState("");


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

  // Cargar libros y categorías desde el backend
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [librosResponse, categoriasResponse] = await Promise.all([
        LibrosService.getLibros(),
        LibrosService.getAllCategorias()
      ]);

      if (librosResponse.success) {
        // Normalizar datos del backend para que coincidan con el formato esperado
        const librosNormalizados = (librosResponse.data || []).map(libro => ({
          id: libro._id,
          titulo: libro.titulo,
          autor: libro.autor,
          editorial: libro.editorial,
          isbn: libro.isbn,
          portada: libro.imagenURL || "https://via.placeholder.com/150x200?text=Sin+Portada",
          categoriaId: libro.categoria?._id || libro.categoria,
          ejemplares: (libro.ejemplares || []).map(ej => ({
            id: ej._id,
            codigo: ej.cdu,
            ubicacion: ej.ubicacionFisica,
            edificio: ej.edificio,
            estado: ej.estado,
            donado: ej.origen === "Donado",
            origen: ej.donado_por,
            precio: ej.precio
          }))
        }));
        setLibros(librosNormalizados);
      } else {
        setError(librosResponse.message || "Error al cargar libros");
      }

      if (categoriasResponse.success) {
        setCategorias(categoriasResponse.data || []);
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar los datos. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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

  const confirmarEliminar = useCallback(async () => {
    const tituloEliminado = libroAEliminar?.titulo;
    try {
      await LibrosService.deleteLibro(libroAEliminar.id);

      // Mostrar toast de éxito
     setDeleteToastMessage(`"${tituloEliminado}" eliminado correctamente`);
     setShowDeleteToast(true);

    setTimeout(() => {
      setShowDeleteToast(false);
    }, 3000);
      
      // Cerrar modal y limpiar estado
      setShowDeleteModal(false);
      setLibroAEliminar(null);
      
      // Recargar datos
      await cargarDatos();
    } catch (err) {
      console.error("Error al eliminar libro:", err);
      
      // Cerrar modal incluso si hay error
      setShowDeleteModal(false);
      setLibroAEliminar(null);
      
      // Mostrar error
      setError(
        err.response?.data?.message || 
        "Error al eliminar el libro. Es posible que ya haya sido eliminado."
      );
      
      // Recargar datos por si acaso se eliminó
      await cargarDatos();
    }
  }, [libroAEliminar, cargarDatos]);

  const handleToggleFilters = useCallback(() => {
    setMostrarFiltros((prev) => !prev);
  }, []);

  // Cálculos memoizados para optimización
  const autoresUnicos = useMemo(
    () => [...new Set(libros.map((libro) => libro.autor))],
    [libros]
  );

  const editorialesUnicas = useMemo(
    () => [...new Set(libros.map((libro) => libro.editorial))],
    [libros]
  );

  const filtrosActivos = useMemo(
    () =>
      Object.values(filtros).filter(
        (valor) => valor !== "" && valor !== null && valor !== undefined
      ).length,
    [filtros]
  );

  // Filtrado de libros memoizado y optimizado
  const librosFiltrados = useMemo(() => {
    const normalize = (txt) =>
      txt
        ?.toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") || "";

    return libros.filter((libro) => {
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
  }, [libros, filtros, contarTotalEjemplares]);

  return (
    <div className={global.backgroundWrapper}>
      <AppHeader />

      <PageTitle title="Catálogo" />

      <div className="mb-4"></div>

      <div className="container">
        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando catálogo...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
            <button 
              className="btn btn-link" 
              onClick={cargarDatos}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
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

            {librosFiltrados.length === 0 && (
              <CatalogoEmptyState
                hasActiveFilters={filtrosActivos > 0}
                onClearFilters={limpiarFiltros}
              />
            )}

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
          </>
        )}
      </div>

      <CatalogoEliminarModal
        show={showDeleteModal}
        libro={libroAEliminar}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmarEliminar}
        contarTotalEjemplares={contarTotalEjemplares}
      />

       {/* toast de eliminar*/}
    <Toast
      show={showDeleteToast}
      message={deleteToastMessage}
    />
    </div>
  );
}
