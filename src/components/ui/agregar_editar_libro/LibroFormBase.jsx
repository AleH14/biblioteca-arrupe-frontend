import React from "react";
import styles from "../../../styles/librosForm.module.css";
import { FiLink } from "react-icons/fi";

// Función helper para detectar el origen de la imagen
const getImageSource = (imageUrl) => {
  if (!imageUrl) return null;

  const url = imageUrl.toLowerCase();

  if (
    url.includes("google.com") ||
    url.includes("googleapis.com") ||
    url.includes("gstatic.com")
  ) {
    return "google";
  }

  if (url.includes("creazilla.com")) {
    return "creazilla";
  }

  return null;
};

const LibroFormBase = React.memo(
  ({
    libro,
    onLibroChange,
    onISBNChange,
    onUrlFocus,
    categorias = [],
    onShowGestionCategorias,
    modoEdicion = false,
    children,
  }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onLibroChange(name, value);
    };

    const handleISBNChange = (e) => {
      onISBNChange(e.target.value);
    };

    // Función para agregar imagen predeterminada
    const handleAddDefaultImage = () => {
      onLibroChange(
        "portada",
        "https://cdn.creazilla.com/emojis/52888/closed-book-emoji-clipart-md.png"
      );
    };

    // Obtener el origen de la imagen actual
    const imageSource = getImageSource(libro.portada);

    // Generar IDs únicos para los campos
    const fieldIds = {
      isbn: `isbn-${Date.now()}`,
      categoriaId: `categoria-${Date.now()}`,
      titulo: `titulo-${Date.now()}`,
      autor: `autor-${Date.now()}`,
      editorial: `editorial-${Date.now()}`,
      portada: `portada-${Date.now()}`,
    };

    return (
      <div className="row mb-4">
        {/* Imagen del Libro - Lado Izquierdo */}
        <div className="col-12 col-md-4">
          <div className={styles.imagenContainer}>
            <div className={styles.portadaWrapper}>
              <img
                src={libro.portada || "/images/libro-placeholder.jpg"}
                alt={libro.titulo || "Nuevo libro"}
                className={styles.portada}
                onError={(e) => {
                  e.target.src = "/images/libro-placeholder.jpg";
                }}
              />
            </div>

            {/* Créditos DEBAJO de la imagen */}
            {imageSource === "google" && (
              <div className={styles.creditContainer}>
                <img
                  src="https://books.google.com/googlebooks/images/poweredby.png?hl=es-419"
                  alt="Google Books"
                  className={styles.googleBooksIcon}
                />
              </div>
            )}

            {imageSource === "creazilla" && (
              <div className={styles.creditContainer}>
                <span className={styles.creazillaCredit}>
                  Imagen vía Creazilla.com
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Formulario - Lado Derecho */}
        <div className="col-12 col-md-8">
          <div className="row">
            {/* ISBN  */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor={fieldIds.isbn} className={styles.formLabel}>
                ISBN *
              </label>
              <div className={styles.inputWithIcon}>
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
                <img
                  src="https://developers.google.com/books/images/google_watermark.gif"
                  alt="Google Books"
                  className={styles.googleBooksIcon}
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="col-12 col-md-6 mb-3">
              <label
                htmlFor={fieldIds.categoriaId}
                className={styles.formLabel}
              >
                Categoría *
              </label>
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
              <label htmlFor={fieldIds.titulo} className={styles.formLabel}>
                Título *
              </label>
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
              <label htmlFor={fieldIds.autor} className={styles.formLabel}>
                Autor *
              </label>
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
              <label htmlFor={fieldIds.editorial} className={styles.formLabel}>
                Editorial *
              </label>
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

            {/* URL de la imagen*/}
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
              <div className={styles.defaultImageContainer}>
                <button
                  type="button"
                  onClick={handleAddDefaultImage}
                  className={styles.defaultImageBtn}
                >
                  Agregar imagen predeterminada
                </button>
              </div>
            </div>

            {/* Children para contenido adicional */}
            {children}
          </div>
        </div>
      </div>
    );
  }
);

LibroFormBase.displayName = "LibroFormBase";

export default LibroFormBase;
