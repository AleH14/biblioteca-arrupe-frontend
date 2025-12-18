"use client";
import React, {useState,useCallback,useMemo,useRef,useEffect} from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../../styles/librosForm.module.css";
import global from "../../../../../styles/Global.module.css";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { buscarLibroPorISBN } from "../../../../../services/googleBooks";

// Componentes
import PageTitle from "../../../../../components/ui/PageTitle";
import ToastError from "../../../../../components/ui/ToastError";
import AppHeaderLibro from "../../../../../components/ui/agregar_editar_libro/AppHeaderLibro";
import LibroFormBase from "../../../../../components/ui/agregar_editar_libro/LibroFormBase";
import EjemplaresManager from "../../../../../components/ui/agregar_editar_libro/EjemplaresManager";
import ConfirmModal from "../../../../../components/ui/agregar_editar_libro/ConfirmModal";

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

export default function EditarLibro({libro: libroProp }) {
  const router = useRouter();

  const [libro, setLibro] = useState(() => {
    // Inicializar con los datos que vienen del prop
    return {
      titulo: libroProp?.titulo || "",
      autor: libroProp?.autor || "",
      editorial: libroProp?.editorial || "",
      isbn: libroProp?.isbn || "",
      portada: libroProp?.portada || "/images/libro-placeholder.png",
      categoriaId: libroProp?.categoriaId || "",
    };
  });

  const [ejemplares, setEjemplares] = useState(() => {
    if (libroProp?.ejemplares && Array.isArray(libroProp.ejemplares)) {
      return libroProp.ejemplares.map((ej) => ({
        id: ej.id || Date.now() + Math.random(),
        codigo: ej.codigo || "",
        ubicacion: ej.ubicacion || "",
        estado: ej.estado || "Disponible",
        edificio: ej.edificio || "",
        donado: ej.donado ?? null,
        origen: ej.origen || "",
        precio: ej.precio || "",
      }));
    }
    return [
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
    ];
  });

  const [categorias, setCategorias] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteEjemplarModal, setShowDeleteEjemplarModal] = useState(false);
  const [ejemplarAEliminar, setEjemplarAEliminar] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // OPTIMIZACIÓN: Usar useRef para valores que no necesitan trigger re-renders
  const validationTimeoutRef = useRef(null);
  const lastISBNRef = useRef(libroProp?.isbn || "");
  const libroRef = useRef(libro);
  const ejemplaresRef = useRef(ejemplares);

  // Sincronizar refs con estado cuando cambia libroProp
  useEffect(() => {
    if (libroProp) {
      setLibro({
        titulo: libroProp.titulo || "",
        autor: libroProp.autor || "",
        editorial: libroProp.editorial || "",
        isbn: libroProp.isbn || "",
        portada: libroProp.portada || "/images/libro-placeholder.png",
        categoriaId: libroProp.categoriaId || "",
      });
      
      if (libroProp.ejemplares && Array.isArray(libroProp.ejemplares)) {
        setEjemplares(
          libroProp.ejemplares.map((ej) => ({
            id: ej.id || Date.now() + Math.random(),
            codigo: ej.codigo || "",
            ubicacion: ej.ubicacion || "",
            estado: ej.estado || "Disponible",
            edificio: ej.edificio || "",
            donado: ej.donado ?? null,
            origen: ej.origen || "",
            precio: ej.precio || "",
          }))
        );
      }
    }
  }, [libroProp]);

  // Sincronizar refs con estado
  useEffect(() => {
    libroRef.current = libro;
    ejemplaresRef.current = ejemplares;
  }, [libro, ejemplares]);

  // Cargar categorías
  useEffect(() => {
    setCategorias([
      { _id: "1", descripcion: "Literatura" },
      { _id: "2", descripcion: "Ciencia" },
      { _id: "3", descripcion: "Tecnología" },
      { _id: "4", descripcion: "Historia" },
      { _id: "5", descripcion: "Filosofía" },
    ]);
  }, []);

  // OPTIMIZACIÓN: Debounce para ISBN con validación de cambio
  const debouncedISBN = useDebounce(libro.isbn, 800);

  // BÚSQUEDA POR ISBN OPTIMIZADA - solo si realmente cambió
  useEffect(() => {
    const buscarPorISBN = async () => {
      // Validación: solo buscar si el ISBN cambió y no está vacío
      if (!debouncedISBN.trim() || debouncedISBN === lastISBNRef.current) {
        return;
      }

      // Validación: solo buscar si el ISBN tiene formato válido (mínimo 10 caracteres)
      if (debouncedISBN.trim().length < 10) {
        return;
      }

      try {
        lastISBNRef.current = debouncedISBN;

        const datosLibro = await buscarLibroPorISBN(debouncedISBN.trim());

        if (datosLibro) {
          setLibro((prev) => ({
            ...prev,
            titulo: datosLibro.titulo || prev.titulo,
            autor: datosLibro.autor || prev.autor,
            editorial: datosLibro.editorial || prev.editorial,
            portada: datosLibro.portada || prev.portada,
          }));
        }
      } catch (error) {
        // No mostrar error al usuario para no interrumpir la experiencia
      }
    };

    buscarPorISBN();
  }, [debouncedISBN]);

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
    const nuevoId =
      ejemplares.length > 0 ? Math.max(...ejemplares.map((e) => e.id)) + 1 : 1;
    setEjemplares((prev) => [
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
    ]);
  }, [ejemplares.length]);

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

  // OPTIMIZACIÓN: Validación más eficiente usando refs
  const validarFormulario = useCallback(() => {
    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    const currentLibro = libroRef.current;
    const currentEjemplares = ejemplaresRef.current;

    let mensajeLibro = "";

    // Validación más rápida sin trim innecesarios
    if (
      !currentLibro.titulo?.trim() ||
      !currentLibro.autor?.trim() ||
      !currentLibro.editorial?.trim() ||
      !currentLibro.isbn?.trim() ||
      !currentLibro.categoriaId?.trim()
    ) {
      mensajeLibro +=
        "Complete todos los campos obligatorios del libro (Título, Autor, Editorial, ISBN, Categoría).";
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
    const ejemplaresCompletos = currentEjemplares.every((ej) => {
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
  }, []);

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

  const handleGuardarConfirmado = useCallback(() => {
    setShowConfirmModal(false);
     router.push("/dashboard/catalogo");
  }, [router]);

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
      <AppHeaderLibro>
        <ToastError
          show={showValidationError}
          message={validationMessage}
          onClose={handleCloseValidationError}
        />
      </AppHeaderLibro>
    ),
    [
      showValidationError,
      validationMessage,
      handleCloseValidationError,
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
        modoEdicion={true}
      />
    ),
    [libro, categorias, handleLibroChange, handleISBNChange]
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
    () => <ConfirmarEdicionButton onConfirm={handleConfirmarEdicion} />,
    [handleConfirmarEdicion]
  );

  return (
    <div className={global.backgroundWrapper}>
      {memoizedHeader}
      {memoizedPageTitle}

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11">
            <div className={styles.formContainer}>
              {memoizedLibroFormBase}

              <hr className={styles.separador} />

              {memoizedEjemplaresManager}

              <hr className={styles.separador} />

              {memoizedConfirmButton}
            </div>
          </div>
        </div>
      </div>

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
          <small className={styles.libroDetalle}>Precio: ${libro.precio}</small>
          {libro.donado && libro.origen && (
            <>
              <br />
              <small className={styles.libroDetalle}>
                Origen: {libro.origen}
              </small>
            </>
          )}
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