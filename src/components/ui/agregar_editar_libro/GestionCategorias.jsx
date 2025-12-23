// ui/agregar_editar_libro/GestionCategorias.jsx
import React, { useState } from "react";
import styles from "../../../styles/librosForm.module.css";
import global from "../../../styles/Global.module.css";
import { FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { LibrosService } from "../../../services";

const GestionCategorias = React.memo(
  ({ show, onClose, categorias, setCategorias, libro, onLibroChange }) => {
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const mostrarError = (mensaje) => {
      setError(mensaje);
      setTimeout(() => setError(""), 3000);
    };

    const handleAgregarCategoria = async () => {
      if (nuevaCategoria.trim()) {
        setLoading(true);
        try {
          // Verificar si ya existe una categoría con el mismo nombre
          const categoriaExistente = categorias.find(
            (cat) =>
              cat.descripcion.toLowerCase() ===
              nuevaCategoria.trim().toLowerCase()
          );

          if (categoriaExistente) {
            mostrarError("Ya existe una categoría con ese nombre");
            setLoading(false);
            return;
          }

          // Llamar al backend para crear la categoría
          const response = await LibrosService.createCategoria(nuevaCategoria.trim());

          if (response.success && response.data) {
            // Agregar la nueva categoría al estado local
            setCategorias((prev) => [...prev, response.data]);
            setNuevaCategoria("");

            // Seleccionar automáticamente la nueva categoría
            onLibroChange("categoriaId", response.data._id);

            // Si estamos en modo edición, salir del modo edición
            if (modoEdicion) {
              setModoEdicion(false);
              setCategoriaEditando(null);
            }
          } else {
            mostrarError(response.message || "Error al agregar la categoría");
          }
        } catch (error) {
          console.error("Error al agregar categoría:", error);
          mostrarError(
            error.response?.data?.message || "Error al agregar la categoría"
          );
        } finally {
          setLoading(false);
        }
      } else {
        mostrarError("Ingrese un nombre para la categoría");
      }
    };

    const handleEditarCategoria = async () => {
      if (nuevaCategoria.trim() && categoriaEditando) {
        setLoading(true);
        try {
          // Verificar si ya existe otra categoría con el mismo nombre (excluyendo la que se está editando)
          const categoriaExistente = categorias.find(
            (cat) =>
              cat._id !== categoriaEditando._id &&
              cat.descripcion.toLowerCase() ===
                nuevaCategoria.trim().toLowerCase()
          );

          if (categoriaExistente) {
            mostrarError("Ya existe una categoría con ese nombre");
            setLoading(false);
            return;
          }

          // Llamar al backend para actualizar la categoría
          const response = await LibrosService.updateCategoria(
            categoriaEditando._id,
            nuevaCategoria.trim()
          );

          if (response.success && response.data) {
            // Actualizar la categoría en el estado local
            const categoriasActualizadas = categorias.map((cat) =>
              cat._id === categoriaEditando._id ? response.data : cat
            );

            setCategorias(categoriasActualizadas);
            setNuevaCategoria("");
            setModoEdicion(false);
            setCategoriaEditando(null);
          } else {
            mostrarError(response.message || "Error al editar la categoría");
          }
        } catch (error) {
          console.error("Error al editar categoría:", error);
          mostrarError(
            error.response?.data?.message || "Error al editar la categoría"
          );
        } finally {
          setLoading(false);
        }
      } else {
        mostrarError("Ingrese un nombre para la categoría");
      }
    };

    const handleEliminarCategoria = async (categoria) => {
      setLoading(true);
      try {
        if (categorias.length <= 1) {
          mostrarError("Debe haber al menos una categoría");
          setLoading(false);
          return;
        }

        // Verificar si la categoría tiene un ID válido de MongoDB (24 caracteres hexadecimales)
        const esIdValido = /^[a-f\d]{24}$/i.test(categoria._id);
        
        if (!esIdValido) {
          // Si es un ID temporal (recién creada pero no guardada), solo eliminar del estado local
          const categoriasActualizadas = categorias.filter(
            (cat) => cat._id !== categoria._id
          );
          setCategorias(categoriasActualizadas);

          if (libro.categoriaId === categoria._id) {
            onLibroChange("categoriaId", "");
          }
          setLoading(false);
          return;
        }

        // Llamar al backend para eliminar la categoría
        await LibrosService.deleteCategoria(categoria._id);
        
        // Eliminar la categoría del estado local
        const categoriasActualizadas = categorias.filter(
          (cat) => cat._id !== categoria._id
        );
        setCategorias(categoriasActualizadas);

        // Si la categoría eliminada era la seleccionada, limpiar selección
        if (libro.categoriaId === categoria._id) {
          onLibroChange("categoriaId", "");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // No mostrar error, simplemente eliminar del estado local
          const categoriasActualizadas = categorias.filter(
            (cat) => cat._id !== categoria._id
          );
          setCategorias(categoriasActualizadas);
          if (libro.categoriaId === categoria._id) {
            onLibroChange("categoriaId", "");
          }
        } else if (error.response?.status === 400) {
          // Error 400 - probablemente tiene libros asociados
          const errorMsg = error.response?.data?.message;
          mostrarError(
            errorMsg || "No se puede eliminar la categoría porque tiene libros asociados."
          );
        } else {
          const errorMsg = error.response?.data?.message;
          mostrarError(
            errorMsg || "Error al eliminar la categoría."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    const iniciarEdicionCategoria = (categoria) => {
      setCategoriaEditando(categoria);
      setNuevaCategoria(categoria.descripcion);
      setModoEdicion(true);
    };

    const cancelarEdicion = () => {
      setModoEdicion(false);
      setCategoriaEditando(null);
      setNuevaCategoria("");
      setError("");
    };

    const handleClose = () => {
      onClose();
      cancelarEdicion();
    };

    if (!show) return null;

    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>
              {modoEdicion ? "Editar Categoría" : "Gestionar Categorías"}
            </h3>
            <button className={styles.modalCloseBtn} onClick={handleClose}>
              <FiX />
            </button>
          </div>
          <div className={styles.modalBody}>
            {/* Mensaje de error */}
            {error && (
              <div className={styles.notificacionError}>
                <div className={styles.errorIcon}>⚠</div>
                <span>{error}</span>
                <button
                  className={styles.errorCloseBtn}
                  onClick={() => setError("")}
                >
                  ✖
                </button>
              </div>
            )}

            {/* Formulario para agregar/editar categoría */}
            <div className={styles.categoriaForm}>
              <label className={styles.formLabel}>
                {modoEdicion ? "Editar categoría" : "Nueva categoría"}
              </label>
              <div className={styles.categoriaInputGroup}>
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => setNuevaCategoria(e.target.value)}
                  className={styles.formInput}
                  placeholder="Ingrese el nombre de la categoría"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      modoEdicion
                        ? handleEditarCategoria()
                        : handleAgregarCategoria();
                    }
                  }}
                />
                <button
                  className={
                    modoEdicion ? global.btnWarning : global.btnPrimary
                  }
                  onClick={
                    modoEdicion ? handleEditarCategoria : handleAgregarCategoria
                  }
                  disabled={!nuevaCategoria.trim() || loading}
                >
                  {loading ? "Guardando..." : modoEdicion ? "Actualizar" : "Agregar"}
                </button>
                {modoEdicion && (
                  <button
                    className={global.btnSecondary}
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            {/* Lista de categorías existentes */}
            <div className={styles.listaCategorias}>
              <h5 className={styles.tituloSeccion}>Categorías Existentes</h5>
              {categorias.length === 0 ? (
                <p className={styles.sinCategorias}>
                  No hay categorías registradas
                </p>
              ) : (
                <div className={styles.categoriasGrid}>
                  {categorias.map((categoria) => (
                    <div key={categoria._id} className={styles.categoriaItem}>
                      <span className={styles.categoriaNombre}>
                        {categoria.descripcion}
                      </span>
                      <div className={styles.categoriaAcciones}>
                        <button
                          className={styles.btnEditar}
                          onClick={() => iniciarEdicionCategoria(categoria)}
                          title="Editar categoría"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className={styles.btnEliminar}
                          onClick={() => handleEliminarCategoria(categoria)}
                          title="Eliminar categoría"
                          disabled={categorias.length <= 1 || loading}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={`${global.btnSecondary} w-auto`}
              onClick={handleClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }
);

GestionCategorias.displayName = "GestionCategorias";

export default GestionCategorias;
