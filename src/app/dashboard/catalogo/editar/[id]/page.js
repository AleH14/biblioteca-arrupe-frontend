"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

// Componente memoizado para el botón de confirmación
const ConfirmarEdicionButton = React.memo(({ onConfirm }) => {
  return (
    <div className={styles.botonesContainer}>
      <button type="button" className={global.btnWarning} onClick={onConfirm}>
        Confirmar Edición
      </button>
    </div>
  );
});

ConfirmarEdicionButton.displayName = "ConfirmarEdicionButton";

export default function EditarLibro() {
  const router = useRouter();
  const params = useParams();
  const libroId = params.id;

  const [libro, setLibro] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    isbn: "",
    portada: "/images/libro-placeholder.jpg",
    categoriaId: "",
  });

  const [ejemplares, setEjemplares] = useState([]);
  const [ejemplaresOriginales, setEjemplaresOriginales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteEjemplarModal, setShowDeleteEjemplarModal] = useState(false);
  const [ejemplarAEliminar, setEjemplarAEliminar] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showGestionCategorias, setShowGestionCategorias] = useState(false);

  // OPTIMIZACIÓN: Usar useRef para valores que no necesitan trigger re-renders
  const validationTimeoutRef = useRef(null);
  const lastISBNRef = useRef("");
  const libroRef = useRef(libro);
  const ejemplaresRef = useRef(ejemplares);

  // Cargar datos del libro desde el backend
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [libroResponse, categoriasResponse] = await Promise.all([
          LibrosService.getLibroById(libroId),
          LibrosService.getAllCategorias()
        ]);

        if (libroResponse.success && libroResponse.data) {
          const libroData = libroResponse.data;
          
          setLibro({
            titulo: libroData.titulo || "",
            autor: libroData.autor || "",
            editorial: libroData.editorial || "",
            isbn: libroData.isbn || "",
            portada: libroData.imagenURL || "/images/libro-placeholder.jpg",
            categoriaId: libroData.categoria?._id || libroData.categoria || "",
          });

          const ejemplaresNormalizados = (libroData.ejemplares || []).map(ej => {
            // Capitalizar el estado (primera letra en mayúscula)
            const estado = ej.estado || "disponible";
            const estadoCapitalizado = estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
            
            return {
              id: ej._id,
              codigo: ej.cdu || "",
              ubicacion: ej.ubicacionFisica || "",
              estado: estadoCapitalizado,
              edificio: ej.edificio || "",
              donado: ej.origen === "Donado",
              origen: ej.donado_por || "",
              precio: ej.precio || "",
              esNuevo: false
            };
          });

          setEjemplares(ejemplaresNormalizados);
          setEjemplaresOriginales(JSON.parse(JSON.stringify(ejemplaresNormalizados)));
        } else {
          setError("Libro no encontrado");
        }

        if (categoriasResponse.success) {
          setCategorias(categoriasResponse.data || []);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos del libro");
      } finally {
        setLoading(false);
      }
    };

    if (libroId) {
      cargarDatos();
    }
  }, [libroId]);

  // Sincronizar refs con estado
  useEffect(() => {
    libroRef.current = libro;
    ejemplaresRef.current = ejemplares;
  }, [libro, ejemplares]);

  // OPTIMIZACIÓN: Handlers memoizados con dependencias mínimas
  const handleLibroChange = useCallback((name, value) => {
    setLibro((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleISBNChange = useCallback((value) => {
    setLibro((prev) => ({
      ...prev,
      isbn: value,
    }));
  }, []);

  const handleEjemplarChange = useCallback((index, field, value) => {
    setEjemplares((prev) => {
      const nuevosEjemplares = [...prev];
      nuevosEjemplares[index] = {
        ...nuevosEjemplares[index],
        [field]: value,
      };
      return nuevosEjemplares;
    });
  }, []);

  const agregarEjemplar = useCallback(() => {
    const nuevoId = `nuevo_${Date.now()}`;
    setEjemplares((prev) => [
      ...prev,
      {
        id: nuevoId,
        codigo: "",
        ubicacion: "",
        estado: "disponible",
        edificio: "",
        donado: null,
        origen: "",
        precio: "",
        esNuevo: true
      },
    ]);
  }, []);

  const confirmarEliminarEjemplar = useCallback((ejemplar) => {
    setEjemplarAEliminar(ejemplar);
    setShowDeleteEjemplarModal(true);
  }, []);

  const eliminarEjemplar = useCallback(() => {
    if (ejemplarAEliminar) {
      setEjemplares((prev) =>
        prev.filter((ej) => ej.id !== ejemplarAEliminar.id)
      );
      setEjemplarAEliminar(null);
      setShowDeleteEjemplarModal(false);
    }
  }, [ejemplarAEliminar]);

  // OPTIMIZACIÓN: Validación más eficiente
  const validarFormulario = useCallback(() => {
    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    let mensajeLibro = "";

    // Validación más rápida sin trim innecesarios
    if (
      !libro.titulo?.trim() ||
      !libro.autor?.trim() ||
      !libro.editorial?.trim() ||
      !libro.isbn?.trim() ||
      !libro.categoriaId?.trim()
    ) {
      mensajeLibro +=
        "Complete todos los campos obligatorios del libro (Título, Autor, Editorial, ISBN, Categoría).";
    }

    if (mensajeLibro) {
      setValidationMessage(mensajeLibro);
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

      // Si es COMPRADO (donado: false), debe tener precio
      if (ej.donado === false && (!ej.precio || Number(ej.precio) <= 0)) {
        return false;
      }

      // Si es DONADO (donado: true), debe tener origen
      if (ej.donado === true && !ej.origen?.trim()) {
        return false;
      }

      return camposBase;
    });

    if (!ejemplaresCompletos) {
      setValidationMessage(
        "Complete todos los campos de cada ejemplar (código, ubicación, edificio, estado, tipo y precio/origen)."
      );
      return false;
    }

    setValidationMessage("");
    return true;
  }, [libro, ejemplares]);

  const handleConfirmarEdicion = useCallback(() => {
    if (!validarFormulario()) {
      setShowValidationError(true);
      // OPTIMIZACIÓN: Usar ref para el timeout
      validationTimeoutRef.current = setTimeout(() => {
        setShowValidationError(false);
      }, 5000);
      return;
    }

    setShowConfirmModal(true);
    setShowValidationError(false);
  }, [validarFormulario]);

  const handleGuardarConfirmado = useCallback(async () => {
    setShowConfirmModal(false);
    setGuardando(true);

    try {
      // 1. Actualizar datos básicos del libro
      const libroData = {
        titulo: libro.titulo,
        autor: libro.autor,
        isbn: libro.isbn,
        categoria: libro.categoriaId,
        editorial: libro.editorial,
        imagenURL: libro.portada !== "/images/libro-placeholder.jpg" ? libro.portada : null
      };

      const updateResponse = await LibrosService.updateLibro(libroId, libroData);

      if (!updateResponse.success) {
        throw new Error(updateResponse.message || "Error al actualizar el libro");
      }

      // 2. Gestionar ejemplares
      const ejemplaresOriginalesIds = ejemplaresOriginales.map(ej => ej.id);
      const ejemplaresActualesIds = ejemplares.map(ej => ej.id);

      // Eliminar ejemplares que ya no están
      const ejemplaresAEliminar = ejemplaresOriginales.filter(
        ej => !ejemplaresActualesIds.includes(ej.id)
      );

      for (const ej of ejemplaresAEliminar) {
        try {
          await LibrosService.removeEjemplar(libroId, ej.id);
        } catch (err) {
          console.error(`Error al eliminar ejemplar ${ej.id}:`, err);
        }
      }

      // Agregar nuevos ejemplares
      const ejemplaresNuevos = ejemplares.filter(
        ej => !ejemplaresOriginalesIds.includes(ej.id) || ej.esNuevo
      );

      for (const ej of ejemplaresNuevos) {
        const ejemplarData = {
          cdu: ej.codigo,
          estado: ej.estado.toLowerCase(),
          ubicacionFisica: ej.ubicacion,
          edificio: ej.edificio,
          origen: ej.donado ? "Donado" : "Comprado",
          precio: ej.donado ? null : Number(ej.precio),
          donado_por: ej.donado ? ej.origen : null
        };

        try {
          await LibrosService.addEjemplar(libroId, ejemplarData);
        } catch (err) {
          console.error("Error al agregar ejemplar:", err);
        }
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        router.push("/dashboard/catalogo");
      }, 2000);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setValidationMessage(
        error.response?.data?.message || "Error al guardar los cambios. Intente nuevamente."
      );
      setShowValidationError(true);
    } finally {
      setGuardando(false);
    }
  }, [libro, ejemplares, ejemplaresOriginales, libroId, router]);

  const handleCloseValidationError = useCallback(() => {
    setShowValidationError(false);
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
  }, []);

  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteEjemplarModal(false);
  }, []);

  const handleShowGestionCategorias = useCallback(() => {
    setShowGestionCategorias(true);
  }, []);

  const handleCloseGestionCategorias = useCallback(() => {
    setShowGestionCategorias(false);
  }, []);

  // Cleanup effect para timeouts
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  const getCategoriaSeleccionada = useCallback(() => {
    return categorias.find((cat) => cat._id === libro.categoriaId);
  }, [categorias, libro.categoriaId]);

  // Componentes memoizados
  const memoizedHeader = useMemo(
    () => (
      <>
        <AppHeaderLibro />
        <ToastError
          show={showValidationError}
          message={validationMessage}
          onClose={handleCloseValidationError}
        />
        <Toast
          show={showSuccessToast}
          message={`"${libro.titulo}" actualizado correctamente`}
        />
      </>
    ),
    [
      showValidationError,
      validationMessage,
      handleCloseValidationError,
      showSuccessToast,
      libro.titulo
    ]
  );

  const memoizedPageTitle = useMemo(
    () => (
      <PageTitle title={`EDICIÓN → ${libro.titulo || "Libro sin título"}`} />
    ),
    [libro.titulo]
  );

  const memoizedLibroFormBase = useMemo(
    () => (
      <LibroFormBase
        libro={libro}
        categorias={categorias}
        onLibroChange={handleLibroChange}
        onISBNChange={handleISBNChange}
        onShowGestionCategorias={handleShowGestionCategorias}
        modoEdicion={true}
      />
    ),
    [libro, categorias, handleLibroChange, handleISBNChange, handleShowGestionCategorias]
  );

  const memoizedEjemplaresManager = useMemo(
    () => (
      <EjemplaresManager
        ejemplares={ejemplares}
        onEjemplarChange={handleEjemplarChange}
        onAgregarEjemplar={agregarEjemplar}
        onEliminarEjemplar={confirmarEliminarEjemplar}
        showDeleteButton={true}
      />
    ),
    [
      ejemplares,
      handleEjemplarChange,
      agregarEjemplar,
      confirmarEliminarEjemplar,
    ]
  );

  const memoizedConfirmButton = useMemo(
    () => (
      <div className={styles.botonesContainer}>
        <button 
          type="button" 
          className={global.btnWarning} 
          onClick={handleConfirmarEdicion}
          disabled={guardando || loading}
        >
          {guardando ? "Guardando..." : "Confirmar Edición"}
        </button>
      </div>
    ),
    [handleConfirmarEdicion, guardando, loading]
  );

  return (
    <div className={global.backgroundWrapper}>
      {memoizedHeader}
      {memoizedPageTitle}

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos del libro...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger m-3" role="alert">
          {error}
          <button className="btn btn-link" onClick={() => router.push("/dashboard/catalogo")}>
            Volver al catálogo
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-11">
              <div className={styles.formContainer}>
                {memoizedLibroFormBase}

                <GestionCategorias
                  show={showGestionCategorias}
                  onClose={handleCloseGestionCategorias}
                  categorias={categorias}
                  setCategorias={setCategorias}
                  libro={libro}
                  onLibroChange={handleLibroChange}
                />

                <hr className={styles.separador} />

                {memoizedEjemplaresManager}

                <hr className={styles.separador} />

                {memoizedConfirmButton}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      <ConfirmModal
        show={showConfirmModal}
        onClose={handleCloseConfirmModal}
        onConfirm={handleGuardarConfirmado}
        title="Confirmar Edición"
        message="¿Estás seguro de que deseas guardar los cambios realizados en este libro?"
        confirmText="Sí, Guardar Cambios"
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
          <small className={styles.libroDetalle}>
            Ejemplares: {ejemplares.length}
          </small>
        </div>
      </ConfirmModal>

      <ConfirmModal
        show={showDeleteEjemplarModal}
        onClose={handleCloseDeleteModal}
        onConfirm={eliminarEjemplar}
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
          <br />
          <small className={styles.ejemplarDetalle}>
            Estado: {ejemplarAEliminar?.estado}
          </small>
        </div>
        <p className={styles.modalWarning}>Esta acción no se puede deshacer.</p>
      </ConfirmModal>
    </div>
  );
}