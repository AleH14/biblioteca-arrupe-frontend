"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "@/styles/librosForm.module.css";
import global from "@/styles/Global.module.css";
import { buscarLibroPorISBN } from "@/services/googleBooks";
import { LibrosService } from "@/services";
import PageTitle from "@/components/ui/PageTitle";
import Toast from "@/components/ui/Toast";
import ToastError from "@/components/ui/ToastError";
import AppHeaderLibro from "@/components/ui/agregar_editar_libro/AppHeaderLibro";
import LibroFormBase from "@/components/ui/agregar_editar_libro/LibroFormBase";
import EjemplaresManager from "@/components/ui/agregar_editar_libro/EjemplaresManager";
import ConfirmModal from "@/components/ui/agregar_editar_libro/ConfirmModal";
import GestionCategorias from "@/components/ui/agregar_editar_libro/GestionCategorias";

// Componentes memoizados para evitar re-renders
const MemoizedAppHeaderLibro = React.memo(AppHeaderLibro);
const MemoizedPageTitle = React.memo(PageTitle);
const MemoizedToast = React.memo(Toast);
const MemoizedToastError = React.memo(ToastError);
const MemoizedLibroFormBase = React.memo(LibroFormBase);
const MemoizedEjemplaresManager = React.memo(EjemplaresManager);
const MemoizedConfirmModal = React.memo(ConfirmModal);
const MemoizedGestionCategorias = React.memo(GestionCategorias);

export default function AgregarLibroPage() {
  const router = useRouter();

  // Estado del libro
  const [libro, setLibro] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    isbn: "",
    portada: "/images/libro-placeholder.jpg",
    categoriaId: "",
  });

  // Estado de ejemplares
  const [ejemplares, setEjemplares] = useState([
    {
      id: 1,
      codigo: "",
      ubicacion: "",
      estado: "Disponible",
      edificio: "",
      donado: null,
      origen: "",
      precio: "",
    },
  ]);

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGestionCategorias, setShowGestionCategorias] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteEjemplarModal, setShowDeleteEjemplarModal] = useState(false);
  const [ejemplarAEliminar, setEjemplarAEliminar] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Refs para optimización 
  const searchAbortControllerRef = useRef(null);

  // Efecto para cerrar automáticamente el ToastError después de 5 segundos
  useEffect(() => {
    let timeoutId;
    if (showValidationError) {
      timeoutId = setTimeout(() => {
        setShowValidationError(false);
      }, 3000); // 5 segundos
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showValidationError]);

  // Debounce para ISBN
  const debouncedISBN = useDebounce(libro.isbn, 1000);

  // Efecto para limpiar campos cuando el ISBN no es válido
  useEffect(() => {
    const isbn = debouncedISBN.trim();

    if (!isbn || isbn.length < 10 || isbn.length > 13) {
      // Si el ISBN está vacío o no es válido, limpiar campos automáticamente
      setLibro((prev) => ({
        ...prev,
        titulo: "",
        autor: "",
        editorial: "",
        portada: "/images/libro-placeholder.jpg",
      }));
      return;
    }
  }, [debouncedISBN]);

  // Búsqueda por ISBN optimizada - SOLO si el ISBN es válido
  useEffect(() => {
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    const isbn = debouncedISBN.trim();

    // Validar antes de hacer la búsqueda
    if (!isbn || isbn.length < 10 || isbn.length > 13) {
      return;
    }

    const buscarPorISBN = async () => {
      const controller = new AbortController();
      searchAbortControllerRef.current = controller;

      try {
        const datosLibro = await buscarLibroPorISBN(isbn, controller.signal);

        if (!controller.signal.aborted && datosLibro) {
          setLibro((prev) => ({
            ...prev,
            titulo: datosLibro.titulo || "",
            autor: datosLibro.autor || "",
            editorial: datosLibro.editorial || "",
            portada: datosLibro.portada || "/images/libro-placeholder.jpg",
          }));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error en búsqueda por ISBN:", error);
        }
      }
    };

    buscarPorISBN();

    return () => {
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
    };
  }, [debouncedISBN]);

  // Cargar categorías desde el backend
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await LibrosService.getAllCategorias();
        if (response.success) {
          setCategorias(response.data || []);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setValidationMessage("Error al cargar categorías");
        setShowValidationError(true);
      }
    };
    cargarCategorias();
  }, []);

  // Handlers para libro 
  const handleLibroChange = useCallback((name, value) => {
    setLibro((prev) =>
      prev[name] === value ? prev : { ...prev, [name]: value }
    );
  }, []);

  const handleISBNChange = useCallback((value) => {
    setLibro((prev) => (prev.isbn === value ? prev : { ...prev, isbn: value }));
  }, []);

  // Handlers para ejemplares 
  const handleEjemplarChange = useCallback((index, field, value) => {
    setEjemplares((prev) => {
      if (prev[index]?.[field] === value) return prev;
      const nuevos = [...prev];
      nuevos[index] = { ...nuevos[index], [field]: value };
      return nuevos;
    });
  }, []);

  const handleAgregarEjemplar = useCallback(() => {
    setEjemplares((prev) => {
      const nuevoId =
        prev.length > 0 ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nuevoId,
          codigo: "",
          ubicacion: "",
          estado: "Disponible",
          edificio: "",
          donado: null, 
          origen: "", 
          precio: "",
        },
      ];
    });
  }, []);

  const handleEliminarEjemplar = useCallback((ejemplar) => {
    setEjemplarAEliminar(ejemplar);
    setShowDeleteEjemplarModal(true);
  }, []);

  const handleConfirmarEliminarEjemplar = useCallback(() => {
    if (ejemplarAEliminar) {
      setEjemplares((prev) =>
        prev.filter((ej) => ej.id !== ejemplarAEliminar.id)
      );
      setEjemplarAEliminar(null);
      setShowDeleteEjemplarModal(false);
    }
  }, [ejemplarAEliminar]);

  // Handlers para modales y UI - MEMOIZADOS para evitar re-renders
  const handleShowGestionCategorias = useCallback(() => {
    setShowGestionCategorias(true);
  }, []);

  const handleCloseGestionCategorias = useCallback(() => {
    setShowGestionCategorias(false);
  }, []);

  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteEjemplarModal(false);
    setEjemplarAEliminar(null);
  }, []);

  const handleCloseValidationError = useCallback(() => {
    setShowValidationError(false);
  }, []);

  // Validación
  const validarFormulario = useCallback(() => {
    if (
      !libro.titulo?.trim() ||
      !libro.autor?.trim() ||
      !libro.editorial?.trim() ||
      !libro.isbn?.trim() ||
      !libro.categoriaId?.trim()
    ) {
      setValidationMessage("Complete todos los campos obligatorios.");
      return false;
    }

    // Validación de URL de imagen
    if (
      !libro.portada?.trim() ||
      libro.portada === "/images/libro-placeholder.jpg"
    ) {
      setValidationMessage("Agregue url de imagen");
      return false;
    }

    // Validación de ejemplares
    if (ejemplares.length === 0) {
      setValidationMessage("Debe agregar al menos un ejemplar.");
      return false;
    }

    // Validar que todos los ejemplares tengan los campos completos
    const ejemplaresCompletos = ejemplares.every((ej) => {
      const camposBase =
        ej.codigo?.trim() &&
        ej.ubicacion?.trim() &&
        ej.edificio?.trim() &&
        ej.estado?.trim();
      // Validar campos específicos de donado/comprado
      if (ej.donado === null) {
        return false;
      }

      if (ej.donado === false && (!ej.precio || Number(ej.precio) <= 0)) {
        return false;
      }

      if (ej.donado === true && !ej.origen?.trim()) {
        return false;
      }

      return camposBase;
    });

    if (!ejemplaresCompletos) {
      setValidationMessage(
        "Complete todos los campos de cada ejemplar (código, ubicación, edificio, estado, origen)."
      );
      return false;
    }

    setValidationMessage("");
    return true;
  }, [libro, ejemplares]);

  const handleConfirmarAgregado = useCallback(() => {
    if (!validarFormulario()) {
      setShowValidationError(true);
      return;
    }
    setShowConfirmModal(true);
  }, [validarFormulario]);

  const handleAgregarConfirmado = useCallback(async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      // Preparar ejemplares para el backend
      const ejemplaresFormateados = ejemplares.map(ej => ({
        cdu: ej.codigo,
        estado: ej.estado.toLowerCase(),
        ubicacionFisica: ej.ubicacion,
        edificio: ej.edificio,
        origen: ej.donado ? "Donado" : "Comprado",
        precio: ej.donado ? null : Number(ej.precio),
        donado_por: ej.donado ? ej.origen : null
      }));

      // Crear libro con ejemplares
      const libroData = {
        titulo: libro.titulo,
        autor: libro.autor,
        isbn: libro.isbn,
        categoria: libro.categoriaId,
        editorial: libro.editorial,
        imagenURL: libro.portada !== "/images/libro-placeholder.jpg" ? libro.portada : null,
        ejemplares: ejemplaresFormateados
      };

      const response = await LibrosService.createLibro(libroData);
      if (response.success) {
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
          router.push("/dashboard/catalogo");
        }, 2000);
      } else {
        setValidationMessage(response.message || "Error al agregar el libro");
        setShowValidationError(true);
      }
    } catch (error) {
      console.error("Error al agregar libro:", error);
      setValidationMessage(
        error.response?.data?.message || "Error al agregar el libro. Intente nuevamente."
      );
      setShowValidationError(true);
    } finally {
      setLoading(false);
    }
  }, [libro, ejemplares, router]);

  const getCategoriaSeleccionada = useCallback(() => {
    return categorias.find((cat) => cat._id === libro.categoriaId);
  }, [categorias, libro.categoriaId]);

 const header = useMemo(
    () => <AppHeaderLibro />, 
    []
  );
  
  const pageTitle = useMemo(
    () => <MemoizedPageTitle title="AGREGAR NUEVO LIBRO" />,
    []
  );

  const libroFormBase = useMemo(
    () => (
      <MemoizedLibroFormBase
        libro={libro}
        categorias={categorias}
        onLibroChange={handleLibroChange}
        onISBNChange={handleISBNChange}
        onShowGestionCategorias={handleShowGestionCategorias}
        modoEdicion={false}
      />
    ),
    [
      libro,
      categorias,
      handleLibroChange,
      handleISBNChange,
      handleShowGestionCategorias,
    ]
  );

  const ejemplaresManager = useMemo(
    () => (
      <MemoizedEjemplaresManager
        ejemplares={ejemplares}
        onEjemplarChange={handleEjemplarChange}
        onAgregarEjemplar={handleAgregarEjemplar}
        onEliminarEjemplar={handleEliminarEjemplar}
        showDeleteButton={true}
      />
    ),
    [
      ejemplares,
      handleEjemplarChange,
      handleAgregarEjemplar,
      handleEliminarEjemplar,
    ]
  );

  const confirmButton = useMemo(
    () => (
      <div className={styles.botonesContainer}>
        <button
          type="button"
          className={global.btnWarning}
          onClick={handleConfirmarAgregado}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Confirmar Agregado"}
        </button>
      </div>
    ),
    [handleConfirmarAgregado, loading]
  );

  return (
    <div className={global.backgroundWrapper}>
      {header}
      {pageTitle}

      {/* ToastError */}
      <MemoizedToastError
        show={showValidationError}
        message={validationMessage}
        onClose={handleCloseValidationError}
      />

      <MemoizedToast
        show={showSuccessToast}
        message={`"${libro.titulo}" agregado correctamente`}
      />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11">
            <div className={styles.formContainer}>
              {libroFormBase}

              <MemoizedGestionCategorias
                show={showGestionCategorias}
                onClose={handleCloseGestionCategorias}
                categorias={categorias}
                setCategorias={setCategorias}
                libro={libro}
                onLibroChange={handleLibroChange}
              />

              <hr className={styles.separador} />

              {ejemplaresManager}

              <hr className={styles.separador} />

              {confirmButton}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <MemoizedConfirmModal
        show={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleAgregarConfirmado}
        title="Confirmar Agregado"
        message="¿Estás seguro de que deseas agregar este nuevo libro al catálogo?"
        confirmText="Sí, Agregar Libro"
      >
        <div className={styles.libroInfo}>
          <strong className={styles.libroTitulo}>{libro.titulo}</strong>
          <br />
          <small className={styles.libroDetalle}>por {libro.autor}</small>
          <br />
          <small className={styles.libroDetalle}>
            Editorial: {libro.editorial}
          </small>
          <br />
          <small className={styles.libroDetalle}>
            Categoría:{" "}
            {getCategoriaSeleccionada()?.descripcion || "No seleccionada"}
          </small>
          <br />
          <small className={styles.libroDetalle}>ISBN: {libro.isbn}</small>
          <br />
          <small className={styles.libroDetalle}>Precio: ${libro.precio}</small>
          <br />
          <small className={styles.libroDetalle}>
            Ejemplares: {ejemplares.length}
          </small>
        </div>
      </MemoizedConfirmModal>

      <MemoizedConfirmModal
        show={showDeleteEjemplarModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmarEliminarEjemplar}
        title="Eliminar Ejemplar"
        message="¿Estás seguro de que deseas eliminar este ejemplar?"
        confirmText="Sí, Eliminar"
      >
        <div className={styles.ejemplarInfo}>
          <strong className={styles.ejemplarCodigo}>
            {ejemplarAEliminar?.codigo || "Ejemplar sin código"}
          </strong>
          <br />
          <small className={styles.ejemplarDetalle}>
            Ubicación: {ejemplarAEliminar?.ubicacion || "Sin ubicación"}
          </small>
        </div>
        <p className={styles.modalWarning}>Esta acción no se puede deshacer.</p>
      </MemoizedConfirmModal>
    </div>
  );
}
