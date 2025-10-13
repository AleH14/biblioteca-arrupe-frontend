"use client";
import React, { useState } from "react";
import styles from "../../styles/librosForm.module.css";
import global from "../../styles/Global.module.css";
import { FiArrowLeft, FiLink } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { buscarLibroPorISBN } from "../../services/googleBooks"; //API de Google Books

export default function AgregarLibro({ volverCatalogo }) {
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    isbn: "",
    precio: "0.00",
    portada: "/images/libro-placeholder.jpg",
  });

  const [ejemplares, setEjemplares] = useState([
    {
      id: 1,
      codigo: "",
      ubicacion: "",
      estado: "Disponible",
    },
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteEjemplarModal, setShowDeleteEjemplarModal] = useState(false);
  const [ejemplarAEliminar, setEjemplarAEliminar] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false); // Nuevo estado para toast de éxito

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro((prev) => ({
      ...prev,
      [name]: value,
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

  // Función para buscar libro por ISBM
  const handleISBNBlur = async () => {
    if (!nuevoLibro.isbn.trim()) return;

    const datosLibro = await buscarLibroPorISBN(nuevoLibro.isbn.trim());
    if (datosLibro) {
      setNuevoLibro((prev) => ({
        ...prev,
        titulo: datosLibro.titulo,
        autor: datosLibro.autor,
        editorial: datosLibro.editorial,
        portada: datosLibro.portada,
      }));
    }
  };

  //----------------------------------------------
  const agregarEjemplar = () => {
    const nuevoId =
      ejemplares.length > 0 ? Math.max(...ejemplares.map((e) => e.id)) + 1 : 1;
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

  // FUNCIÓN DE VALIDACIÓN SIMPLIFICADA
  const validarFormulario = () => {
    // Validar campos básicos del libro
    if (
      !nuevoLibro.titulo.trim() ||
      !nuevoLibro.autor.trim() ||
      !nuevoLibro.editorial.trim() ||
      !nuevoLibro.isbn.trim()
    ) {
      setValidationMessage(
        "Por favor, complete todos los campos obligatorios del libro (Título, Autor, Editorial, ISBN)"
      );
      return false;
    }

    // Validar que haya al menos un ejemplar con código y ubicación
    const ejemplaresValidos = ejemplares.filter(
      (ejemplar) => ejemplar.codigo.trim() && ejemplar.ubicacion.trim()
    );

    if (ejemplaresValidos.length === 0) {
      setValidationMessage(
        "Debe agregar al menos un ejemplar con código y ubicación completos"
      );
      return false;
    }

    return true;
  };

  const handleConfirmarAgregado = () => {
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

  const handleAgregarConfirmado = () => {
    // Aquí iría la lógica para agregar el libro a la base de datos
    console.log("Nuevo libro:", nuevoLibro);
    console.log("Ejemplares:", ejemplares);

    // Mostrar notificación y volver al catálogo
    setShowConfirmModal(false);

    // Mostrar toast de éxito
    setShowSuccessToast(true);

    // Después de 3 segundos, redirigir al catálogo
    setTimeout(() => {
      setShowSuccessToast(false);
      volverCatalogo();
    }, 3000);
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
                AGREGAR NUEVO LIBRO
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

      {/* Toast de Éxito */}
      {showSuccessToast && (
        <div className={styles.notificacionExito}>
          <div className={styles.successIcon}>✓</div>
          <span>"{nuevoLibro.titulo}" agregado correctamente</span>
        </div>
      )}

      {/* Formulario de Agregar Libro */}
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
                        src={nuevoLibro.portada}
                        alt={nuevoLibro.titulo || "Nuevo libro"}
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
                      <label className={styles.formLabel}>ISBN *</label>
                      <div className={styles.inputWithIcon}>
                        <input
                          type="text"
                          name="isbn"
                          value={nuevoLibro.isbn}
                          onChange={handleChange}
                          onBlur={handleISBNBlur} // <-- esto hace la consulta automática
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

                    {/* Título */}
                    <div className="col-12 mb-3">
                      <label className={styles.formLabel}>Título *</label>
                      <input
                        type="text"
                        name="titulo"
                        value={nuevoLibro.titulo}
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
                        value={nuevoLibro.autor}
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
                        value={nuevoLibro.editorial}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Ingrese la editorial"
                        required
                      />
                    </div>

                    {/* Precio Estimado */}
                    <div className="col-12 col-md-6 mb-3">
                      <label className={styles.formLabel}>
                        Precio estimado
                      </label>
                      <div className={styles.precioInputGroup}>
                        <span className={styles.precioPrefix}>$</span>
                        <input
                          type="number"
                          name="precio"
                          value={nuevoLibro.precio}
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
                      <label className={styles.formLabel}>
                        URL de la imagen del libro
                      </label>
                      <div className={styles.urlInputGroup}>
                        <span className={styles.urlIcon}>
                          <FiLink />
                        </span>
                        <input
                          type="text"
                          name="portada"
                          value={nuevoLibro.portada}
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
                    <span className={global.btnPrimaryMas}>+</span> Agregar
                    Ejemplar
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
                      {ejemplares.map((ejemplar, index) => (
                        <tr key={ejemplar.id}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={ejemplar.codigo}
                              onChange={(e) =>
                                handleEjemplarChange(
                                  index,
                                  "codigo",
                                  e.target.value
                                )
                              }
                              className={styles.tablaInput}
                              placeholder="Código del ejemplar"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={ejemplar.ubicacion}
                              onChange={(e) =>
                                handleEjemplarChange(
                                  index,
                                  "ubicacion",
                                  e.target.value
                                )
                              }
                              className={styles.tablaInput}
                              placeholder="Ubicación del ejemplar"
                            />
                          </td>
                          <td>
                            <select
                              value={ejemplar.estado}
                              onChange={(e) =>
                                handleEjemplarChange(
                                  index,
                                  "estado",
                                  e.target.value
                                )
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
                            {ejemplares.length > 1 && (
                              <button
                                type="button"
                                className={`${global.btnSecondary} ${styles.eliminarBtn}`}
                                onClick={() =>
                                  confirmarEliminarEjemplar(ejemplar)
                                }
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
                  onClick={handleConfirmarAgregado}
                >
                  Confirmar Agregado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Agregado */}
      {showConfirmModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirmar Agregado</h3>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowConfirmModal(false)}
              >
                ✖
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                ¿Estás seguro de que deseas agregar este nuevo libro al
                catálogo?
              </p>
              <div className={styles.libroInfo}>
                <strong className={styles.libroTitulo}>
                  {nuevoLibro.titulo}
                </strong>
                <br />
                <small className={styles.libroDetalle}>
                  por {nuevoLibro.autor}
                </small>
                <br />
                <small className={styles.libroDetalle}>
                  Editorial: {nuevoLibro.editorial}
                </small>
                <br />
                <small className={styles.libroDetalle}>
                  ISBN: {nuevoLibro.isbn}
                </small>
                <br />
                <small className={styles.libroDetalle}>
                  Precio: ${nuevoLibro.precio}
                </small>
                <br />
                <small className={styles.libroDetalle}>
                  Ejemplares: {ejemplares.length}
                </small>
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
                onClick={handleAgregarConfirmado}
              >
                Sí, Agregar Libro
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
              <p className={styles.modalText}>
                ¿Estás seguro de que deseas eliminar este ejemplar?
              </p>
              <div className={styles.ejemplarInfo}>
                <strong className={styles.ejemplarCodigo}>
                  {ejemplarAEliminar.codigo || "Ejemplar sin código"}
                </strong>
                <br />
                <small className={styles.ejemplarDetalle}>
                  Ubicación: {ejemplarAEliminar.ubicacion || "Sin ubicación"}
                </small>
                <br />
                <small className={styles.ejemplarDetalle}>
                  Estado: {ejemplarAEliminar.estado}
                </small>
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
                className={global.btnSecondary}
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
