import React from 'react';
import styles from "../../../styles/librosForm.module.css";
import { FiLink } from "react-icons/fi";

const LibroFormBase = React.memo(({ 
  libro, 
  onLibroChange, 
  onISBNChange,
  onUrlFocus,
  categorias = [],
  onShowGestionCategorias,
  modoEdicion = false,
  children 
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onLibroChange(name, value);
  };

  const handleISBNChange = (e) => {
    onISBNChange(e.target.value);
  };

  // Generar IDs únicos para los campos
  const fieldIds = {
    isbn: `isbn-${Date.now()}`,
    categoriaId: `categoria-${Date.now()}`,
    titulo: `titulo-${Date.now()}`,
    autor: `autor-${Date.now()}`,
    editorial: `editorial-${Date.now()}`,
    precio: `precio-${Date.now()}`,
    origen: `origen-${Date.now()}`,
    portada: `portada-${Date.now()}`
  };

  return (
    <div className="row mb-4">
      {/* Imagen del Libro - Lado Izquierdo */}
      <div className="col-12 col-md-4">
        <div className={styles.imagenContainer}>
          <div className={styles.portadaWrapper}>
            <img
              src={libro.portada}
              alt={libro.titulo || "Nuevo libro"}
              className={styles.portada}
              onError={(e) => {
                e.target.src = "/images/libro-placeholder.png";
              }}
            />
          </div>
        </div>
      </div>

      {/* Formulario - Lado Derecho */}
      <div className="col-12 col-md-8">
        <div className="row">
          {/* ISBN */}
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor={fieldIds.isbn} className={styles.formLabel}>ISBN *</label>
            <input
              id={fieldIds.isbn}
              type="text"
              name="isbn"
              value={libro.isbn}
              onChange={handleISBNChange}
              className={styles.formInput}
              placeholder="Ingrese el ISBN"
              required
              autoComplete="isbn"
            />
          </div>

          {/* Categoría */}
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor={fieldIds.categoriaId} className={styles.formLabel}>Categoría *</label>
            <div className={styles.categoriaWrapper}>
              <div className={styles.categoriaContainer}>
                <select
                  id={fieldIds.categoriaId}
                  value={libro.categoriaId}
                  onChange={handleChange}
                  name="categoriaId"
                  className={styles.formInput}
                  required
                  autoComplete="category"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              {!modoEdicion && onShowGestionCategorias && (
                <button
                  type="button"
                  className={styles.gestionarCategoriasBtn}
                  onClick={onShowGestionCategorias}
                  title="Gestionar categorías"
                >
                  +
                </button>
              )}
            </div>
          </div>

          {/* Título */}
          <div className="col-12 mb-3">
            <label htmlFor={fieldIds.titulo} className={styles.formLabel}>Título *</label>
            <input
              id={fieldIds.titulo}
              type="text"
              name="titulo"
              value={libro.titulo}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Ingrese el título del libro"
              required
              autoComplete="title"
            />
          </div>

          {/* Autor */}
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor={fieldIds.autor} className={styles.formLabel}>Autor *</label>
            <input
              id={fieldIds.autor}
              type="text"
              name="autor"
              value={libro.autor}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Ingrese el autor"
              required
              autoComplete="author"
            />
          </div>

          {/* Editorial */}
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor={fieldIds.editorial} className={styles.formLabel}>Editorial *</label>
            <input
              id={fieldIds.editorial}
              type="text"
              name="editorial"
              value={libro.editorial}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Ingrese la editorial"
              required
              autoComplete="organization"
            />
          </div>

          {/* Precio Estimado */}
          <div className="col-12 col-md-6 mb-3">
            <label htmlFor={fieldIds.precio} className={styles.formLabel}>
              Precio estimado {libro.donado === false && "*"}
            </label>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.precioInputGroup} style={{ flex: 1 }}>
                <span className={styles.precioPrefix}>$</span>
                <input
                  id={fieldIds.precio}
                  type="number"
                  name="precio"
                  value={libro.precio}
                  onChange={handleChange}
                  className={`${styles.formInput} ${styles.precioInput}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required={libro.donado === false}
                  autoComplete="transaction-amount"
                />
              </div>
            </div>
          </div>

          {/* Origen (solo si es Donado) */}
          {libro.donado === true && (
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor={fieldIds.origen} className={styles.formLabel}>Origen del libro *</label>
              <input
                id={fieldIds.origen}
                type="text"
                name="origen"
                value={libro.origen || ""}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ingrese el origen"
                required
                autoComplete="off"
              />
            </div>
          )}

          {/* Selector Donado / Comprado */}
          <div className="col-12 mb-3">
            <div className={styles.selectorDonacionContainer}>
              <button
                type="button"
                onClick={() => onLibroChange("donado", true)}
                className={`${styles.selectorBtn} ${libro.donado === true ? styles.selectorBtnDonadoActivo : ""}`}
              >
                📘 Donado
              </button>
              <button
                type="button"
                onClick={() => onLibroChange("donado", false)}
                className={`${styles.selectorBtn} ${libro.donado === false ? styles.selectorBtnCompradoActivo : ""}`}
              >
                💰 Comprado
              </button>
            </div>
          </div>

          {/* URL de la imagen */}
          <div className="col-12 mb-3">
            <label htmlFor={fieldIds.portada} className={styles.formLabel}>
              URL de la imagen del libro
            </label>
            <div className={styles.urlInputGroup}>
              <span className={styles.urlIcon}>
                <FiLink />
              </span>
              <input
                id={fieldIds.portada}
                type="text"
                name="portada"
                value={libro.portada}
                onChange={handleChange}
                onFocus={onUrlFocus}
                className={styles.urlInput}
                placeholder="https://ejemplo.com/imagen.jpg"
                autoComplete="photo"
              />
            </div>
            <small className={styles.helperText}>
              Los cambios se reflejarán inmediatamente en la imagen
            </small>
          </div>

          {/* Children para contenido adicional */}
          {children}
        </div>
      </div>
    </div>
  );
});

LibroFormBase.displayName = 'LibroFormBase';

export default LibroFormBase;