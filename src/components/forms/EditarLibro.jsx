"use client";
import React, { useState } from "react";
import styles from "../../styles/librosForm.module.css";
import global from "../../styles/Global.module.css";
import { FiArrowLeft, FiLink } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

export default function EditarLibro({ volverCatalogo, libro }) {
  // Asegurarnos de que libro tenga los valores por defecto correctos
  const [libroEditado, setLibroEditado] = useState({
    titulo: libro?.titulo || "",
    autor: libro?.autor || "",
    editorial: libro?.editorial || "",
    isbn: libro?.isbn || "",
    precio: libro?.precio || "0.00",
    portada: libro?.portada || "/images/libro-placeholder.png",
  });

  // CORRECIÓN: Asegurar que ejemplares siempre sea un array
  const [ejemplares, setEjemplares] = useState(() => {
    // Si libro.ejemplares existe y es un array, lo usamos
    if (libro?.ejemplares && Array.isArray(libro.ejemplares)) {
      return libro.ejemplares;
    }
    // Si no, creamos un array por defecto
    return [
      {
        id: 1,
        codigo: "",
        ubicacion: "",
        estado: "Disponible",
      },
    ];
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteEjemplarModal, setShowDeleteEjemplarModal] = useState(false);
  const [ejemplarAEliminar, setEjemplarAEliminar] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLibroEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUrlFocus = (e) => {
    e.target.select();
  };

  const handleEjemplarChange = (index, field, value) => {
    const nuevosEjemplares = [...ejemplares];
    nuevosEjemplares[index][field] = value;
    setEjemplares(nuevosEjemplares);
  };

  const agregarEjemplar = () => {
    const nuevoId = ejemplares.length > 0 ? Math.max(...ejemplares.map(e => e.id)) + 1 : 1;
    setEjemplares([
      ...ejemplares,
      {
        id: nuevoId,
        codigo: "",
        ubicacion: "",
        estado: "Disponible",
      },
    ]);
  };

  const confirmarEliminarEjemplar = (ejemplar) => {
    setEjemplarAEliminar(ejemplar);
    setShowDeleteEjemplarModal(true);
  };

  const eliminarEjemplar = () => {
    if (ejemplarAEliminar) {
      setEjemplares(ejemplares.filter((ej) => ej.id !== ejemplarAEliminar.id));
      setEjemplarAEliminar(null);
      setShowDeleteEjemplarModal(false);
    }
  };

  // FUNCIÓN DE VALIDACIÓN
  const validarFormulario = () => {
    // Validar campos básicos del libro
    if (!libroEditado.titulo.trim() || 
        !libroEditado.autor.trim() || 
        !libroEditado.editorial.trim() || 
        !libroEditado.isbn.trim()) {
      setValidationMessage("Por favor, complete todos los campos obligatorios del libro (Título, Autor, Editorial, ISBN)");
      return false;
    }

    // Validar que haya al menos un ejemplar con código y ubicación
    const ejemplaresValidos = ejemplares.filter(ejemplar => 
      ejemplar.codigo.trim() && ejemplar.ubicacion.trim()
    );

    if (ejemplaresValidos.length === 0) {
      setValidationMessage("Debe tener al menos un ejemplar con código y ubicación completos");
      return false;
    }

    return true;
  };

  const handleConfirmarEdicion = () => {
    // Validar el formulario antes de mostrar el modal
    if (!validarFormulario()) {
      setShowValidationError(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowValidationError(false);
      }, 5000);
      return;
    }
    
    // Si la validación es exitosa, mostrar el modal de confirmación
    setShowConfirmModal(true);
    setShowValidationError(false);
  };

  const handleGuardarConfirmado = () => {
    console.log("Libro editado:", libroEditado);
    console.log("Ejemplares:", ejemplares);
    setShowConfirmModal(false);
    volverCatalogo();
  };

  return (
    <div className={global.backgroundWrapper}>
      {/* Header */}
      <header
        className={`${global.header} d-flex justify-content-between align-items-center`}
      >
        <button className={styles.volverBtn} onClick={volverCatalogo}>
          <FiArrowLeft className={styles.volverIcon} />
          <span className={styles.volverTexto}>Volver a Catálogo</span>
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </header>

      {/* Título */}
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={global.complementoImg + " me-2"}
              />
              <h1 className={`${styles.tituloPagina} mb-0`}>
                EDICIÓN → {libroEditado.titulo || "Libro sin título"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de Error de Validación */}
      {showValidationError && (
        <div className={styles.notificacionError}>
          <div className={styles.errorIcon}>⚠</div>
          <span>{validationMessage}</span>
          <button 
            className={styles.errorCloseBtn}
            onClick={() => setShowValidationError(false)}
          >
            ✖
          </button>
        </div>
      )}

      {/* Formulario de Edición */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-11">
            <div className={styles.formContainer}>
              
              {/* Sección Superior: Imagen y Formulario */}
              <div className="row mb-4">
                {/* Imagen del Libro - Lado Izquierdo */}
                <div className="col-12 col-md-4">
                  <div className={styles.imagenContainer}>
                    <div className={styles.portadaWrapper}>
                      <img
                        src={libroEditado.portada}
                        alt={libroEditado.titulo || "Libro"}
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
                    {/* Título */}
                    <div className="col-12 mb-3">
                      <label className={styles.formLabel}>Título *</label>
                      <input
                        type="text"
                        name="titulo"
                        value={libroEditado.titulo}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Ingrese el título del libro"
                        required
                      />
                    </div>

                    {/* Autor */}
                    <div className="col-12 col-md-6 mb-3">
                      <label className={styles.formLabel}>Autor *</label>
                      <input
                        type="text"
                        name="autor"
                        value={libroEditado.autor}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Ingrese el autor"
                        required
                      />
                    </div>

                    {/* Editorial */}
                    <div className="col-12 col-md-6 mb-3">
                      <label className={styles.formLabel}>Editorial *</label>
                      <input
                        type="text"
                        name="editorial"
                        value={libroEditado.editorial}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Ingrese la editorial"
                        required
                      />
                    </div>

                    {/* ISBN */}
                    <div className="col-12 col-md-6 mb-3">
                      <label className={styles.formLabel}>ISBN *</label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="text"
                          name="isbn"
                          value={libroEditado.isbn}
                          onChange={handleChange}
                          className={`${styles.formInput} ${styles.inputWithGoogleIcon}`}
                          placeholder="Ingrese el ISBN"
                          required
                        />
                        <img
                          src="https://developers.google.com/books/images/google_watermark.gif"
                          alt="Google Books"
                          className={styles.googleBooksIcon}
                        />
                      </div>
                    </div>

                    {/* Precio Estimado */}
                    <div className="col-12 col-md-6 mb-3">
                      <label className={styles.formLabel}>Precio estimado</label>
                      <div className={styles.precioInputGroup}>
                        <span className={styles.precioPrefix}>$</span>
                        <input
                          type="number"
                          name="precio"
                          value={libroEditado.precio}
                          onChange={handleChange}
                          className={`${styles.formInput} ${styles.precioInput}`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* URL de la imagen */}
                    <div className="col-12 mb-3">
                      <label className={styles.formLabel}>URL de la imagen del libro</label>
                      <div className={styles.urlInputGroup}>
                        <span className={styles.urlIcon}>
                          <FiLink />
                        </span>
                        <input
                          type="text"
                          name="portada"
                          value={libroEditado.portada}
                          onChange={handleChange}
                          onFocus={handleUrlFocus}
                          className={styles.urlInput}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                      <small className={styles.helperText}>
                        Los cambios se reflejarán inmediatamente en la imagen
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Línea separadora */}
              <hr className={styles.separador} />

              {/* Sección de Ejemplares */}
              <div className="mb-4">
                <div className={styles.encabezadoSeccion}>
                  <h5 className={styles.tituloSeccion}>Ejemplares</h5>
                  <button
                    type="button"
                    className={global.btnPrimary}
                    onClick={agregarEjemplar}
                  >
                    <span className={global.btnPrimaryMas}>+</span> Agregar Ejemplar
                  </button>
                </div>

                {/* Tabla de Ejemplares Responsiva */}
                <div className={styles.tablaResponsive}>
                  <table className={styles.tabla}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Código</th>
                        <th>Ubicación</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* CORRECIÓN: Aseguramos que ejemplares sea un array antes de usar map */}
                      {Array.isArray(ejemplares) && ejemplares.map((ejemplar, index) => (
                        <tr key={ejemplar.id || index}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={ejemplar.codigo || ""}
                              onChange={(e) =>
                                handleEjemplarChange(index, "codigo", e.target.value)
                              }
                              className={styles.tablaInput}
                              placeholder="Código del ejemplar"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={ejemplar.ubicacion || ""}
                              onChange={(e) =>
                                handleEjemplarChange(index, "ubicacion", e.target.value)
                              }
                              className={styles.tablaInput}
                              placeholder="Ubicación del ejemplar"
                            />
                          </td>
                          <td>
                            <select
                              value={ejemplar.estado || "Disponible"}
                              onChange={(e) =>
                                handleEjemplarChange(index, "estado", e.target.value)
                              }
                              className={styles.tablaSelect}
                            >
                              <option value="Disponible">Disponible</option>
                              <option value="Prestado">Prestado</option>
                              <option value="Reservado">Reservado</option>
                              <option value="Perdido">Perdido</option>
                            </select>
                          </td>
                          <td>
                            {/* Solo mostrar botón eliminar si hay más de un ejemplar */}
                            {ejemplares.length > 1 && (
                              <button
                                type="button"
                                className={`${global.btnSecondary} ${styles.eliminarBtn}`}
                                onClick={() => confirmarEliminarEjemplar(ejemplar)}
                              >
                                Eliminar Ejemplar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Línea separadora */}
              <hr className={styles.separador} />

              {/* Botón de Confirmación */}
              <div className={styles.botonesContainer}>
                <button
                  type="button"
                  className={global.btnWarning}
                  onClick={handleConfirmarEdicion}
                >
                  Confirmar Edición
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Edición */}
      {showConfirmModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirmar Edición</h3>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setShowConfirmModal(false)}
              >
                ✖
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>¿Estás seguro de que deseas guardar los cambios realizados en el libro?</p>
              <div className={styles.libroInfo}>
                <strong className={styles.libroTitulo}>{libroEditado.titulo}</strong>
                <br />
                <small className={styles.libroDetalle}>por {libroEditado.autor}</small>
                <br />
                <small className={styles.libroDetalle}>Editorial: {libroEditado.editorial}</small>
                <br />
                <small className={styles.libroDetalle}>ISBN: {libroEditado.isbn}</small>
                <br />
                <small className={styles.libroDetalle}>Precio: ${libroEditado.precio}</small>
                <br />
                <small className={styles.libroDetalle}>Ejemplares: {ejemplares.length}</small>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={global.btnSecondary}
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>
              <button
                className={global.btnWarning}
                onClick={handleGuardarConfirmado}
              >
                Sí, Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminar Ejemplar */}
      {showDeleteEjemplarModal && ejemplarAEliminar && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Eliminar Ejemplar</h3>
              <button 
                className={styles.modalCloseBtn}
                onClick={() => setShowDeleteEjemplarModal(false)}
              >
                ✖
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>¿Estás seguro de que deseas eliminar este ejemplar?</p>
              <div className={styles.ejemplarInfo}>
                <strong className={styles.ejemplarCodigo}>{ejemplarAEliminar.codigo || "Ejemplar sin código"}</strong>
                <br />
                <small className={styles.ejemplarDetalle}>Ubicación: {ejemplarAEliminar.ubicacion || "Sin ubicación"}</small>
                <br />
                <small className={styles.ejemplarDetalle}>Estado: {ejemplarAEliminar.estado}</small>
              </div>
              <p className={styles.modalWarning}>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={global.btnSecondary}
                onClick={() => setShowDeleteEjemplarModal(false)}
              >
                Cancelar
              </button>
              <button
                className={global.btnWarning}
                onClick={eliminarEjemplar}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}