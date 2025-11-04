// ui/agregar_editar_libro/GestionCategorias.jsx
import React, { useState } from 'react';
import styles from "../../../styles/librosForm.module.css";
import global from "../../../styles/Global.module.css";
import { FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

const GestionCategorias = React.memo(({
  show,
  onClose,
  categorias,
  setCategorias,
  libro,
  onLibroChange
}) => {
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState("");

  const mostrarError = (mensaje) => {
    setError(mensaje);
    setTimeout(() => setError(""), 3000);
  };

  const handleAgregarCategoria = () => {
    if (nuevaCategoria.trim()) {
      try {
        // Verificar si ya existe una categoría con el mismo nombre
        const categoriaExistente = categorias.find(
          cat => cat.descripcion.toLowerCase() === nuevaCategoria.trim().toLowerCase()
        );
        
        if (categoriaExistente) {
          mostrarError("Ya existe una categoría con ese nombre");
          return;
        }

        const nuevaCat = {
          _id: Date.now().toString(),
          descripcion: nuevaCategoria.trim()
        };
        
        setCategorias(prev => [...prev, nuevaCat]);
        setNuevaCategoria("");
        
        // Seleccionar automáticamente la nueva categoría
        onLibroChange("categoriaId", nuevaCat._id);

        // Si estamos en modo edición, salir del modo edición
        if (modoEdicion) {
          setModoEdicion(false);
          setCategoriaEditando(null);
        }
      } catch (error) {
        mostrarError("Error al agregar la categoría");
      }
    } else {
      mostrarError("Ingrese un nombre para la categoría");
    }
  };

  const handleEditarCategoria = () => {
    if (nuevaCategoria.trim() && categoriaEditando) {
      try {
        // Verificar si ya existe otra categoría con el mismo nombre (excluyendo la que se está editando)
        const categoriaExistente = categorias.find(
          cat => 
            cat._id !== categoriaEditando._id && 
            cat.descripcion.toLowerCase() === nuevaCategoria.trim().toLowerCase()
        );
        
        if (categoriaExistente) {
          mostrarError("Ya existe una categoría con ese nombre");
          return;
        }

        const categoriasActualizadas = categorias.map(cat =>
          cat._id === categoriaEditando._id 
            ? { ...cat, descripcion: nuevaCategoria.trim() }
            : cat
        );
        
        setCategorias(categoriasActualizadas);
        setNuevaCategoria("");
        setModoEdicion(false);
        setCategoriaEditando(null);
      } catch (error) {
        mostrarError("Error al editar la categoría");
      }
    } else {
      mostrarError("Ingrese un nombre para la categoría");
    }
  };

  const handleEliminarCategoria = (categoria) => {
    try {
      if (categorias.length <= 1) {
        mostrarError("Debe haber al menos una categoría");
        return;
      }

      const categoriasActualizadas = categorias.filter(cat => cat._id !== categoria._id);
      setCategorias(categoriasActualizadas);
      
      // Si la categoría eliminada era la seleccionada, limpiar selección
      if (libro.categoriaId === categoria._id) {
        onLibroChange("categoriaId", "");
      }
    } catch (error) {
      mostrarError("Error al eliminar la categoría");
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
            {modoEdicion ? 'Editar Categoría' : 'Gestionar Categorías'}
          </h3>
          <button
            className={styles.modalCloseBtn}
            onClick={handleClose}
          >
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
              {modoEdicion ? 'Editar categoría' : 'Nueva categoría'}
            </label>
            <div className={styles.categoriaInputGroup}>
              <input
                type="text"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                className={styles.formInput}
                placeholder="Ingrese el nombre de la categoría"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    modoEdicion ? handleEditarCategoria() : handleAgregarCategoria();
                  }
                }}
              />
              <button
                className={modoEdicion ? global.btnWarning : global.btnPrimary}
                onClick={modoEdicion ? handleEditarCategoria : handleAgregarCategoria}
                disabled={!nuevaCategoria.trim()}
              >
                {modoEdicion ? 'Actualizar' : 'Agregar'}
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
              <p className={styles.sinCategorias}>No hay categorías registradas</p>
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
                        disabled={categorias.length <= 1}
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
            className={global.btnSecondary}
            onClick={handleClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
});

GestionCategorias.displayName = 'GestionCategorias';

export default GestionCategorias;