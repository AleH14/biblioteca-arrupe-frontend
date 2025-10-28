"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/librosForm.module.css";
import global from "../../styles/Global.module.css";
import { FiArrowLeft, FiLink, FiPlus, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { buscarLibroPorISBN } from "../../services/googleBooks";

export default function AgregarLibro({ volverCatalogo }) {
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    isbn: "",
    precio: "0.00",
    donado: null,
    portada: "/images/libro-placeholder.jpg",
    categoriaId: ""
  });

  const [ejemplares, setEjemplares] = useState([
    {
      id: 1,
      codigo: "",
      ubicacion: "",
      estado: "Disponible",
    },
  ]);

  // Estados para categorías
  const [categorias, setCategorias] = useState([]);
  const [showGestionCategorias, setShowGestionCategorias] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteEjemplarModal, setShowDeleteEjemplarModal] = useState(false);
  const [ejemplarAEliminar, setEjemplarAEliminar] = useState(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Simular carga de categorías desde API
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const categoriasDesdeAPI = [
          { _id: "1", descripcion: "Literatura" },
          { _id: "2", descripcion: "Ciencia" },
          { _id: "3", descripcion: "Tecnología" },
          { _id: "4", descripcion: "Historia" },
          { _id: "5", descripcion: "Filosofía" }
        ];
        setCategorias(categoriasDesdeAPI);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    
    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambio de categoría
  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setNuevoLibro((prev) => ({
      ...prev,
      categoriaId
    }));
  };

  // Obtener la categoría seleccionada
  const getCategoriaSeleccionada = () => {
    return categorias.find(cat => cat._id === nuevoLibro.categoriaId);
  };

  // Agregar nueva categoría
  const handleAgregarCategoria = () => {
    if (nuevaCategoria.trim()) {
      try {
        const nuevaCat = {
          _id: Date.now().toString(),
          descripcion: nuevaCategoria.trim()
        };
        
        setCategorias(prev => [...prev, nuevaCat]);
        setNuevaCategoria("");
        
        // Seleccionar automáticamente la nueva categoría
        setNuevoLibro(prev => ({
          ...prev,
          categoriaId: nuevaCat._id
        }));

        // Si estamos en modo edición, salir del modo edición
        if (modoEdicion) {
          setModoEdicion(false);
          setCategoriaEditando(null);
        }
      } catch (error) {
        console.error("Error agregando categoría:", error);
      }
    }
  };

  // Editar categoría
  const handleEditarCategoria = async () => {
    if (nuevaCategoria.trim() && categoriaEditando) {
      try {
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
        console.error("Error editando categoría:", error);
      }
    }
  };

  // Eliminar categoría
  const handleEliminarCategoria = (categoria) => {
    try {
      const categoriasActualizadas = categorias.filter(cat => cat._id !== categoria._id);
      setCategorias(categoriasActualizadas);
      
      // Si la categoría eliminada era la seleccionada, limpiar selección
      if (nuevoLibro.categoriaId === categoria._id) {
        setNuevoLibro(prev => ({
          ...prev,
          categoriaId: ""
        }));
      }
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    }
  };

  // Iniciar edición de categoría
  const iniciarEdicionCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setNuevaCategoria(categoria.descripcion);
    setModoEdicion(true);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setModoEdicion(false);
    setCategoriaEditando(null);
    setNuevaCategoria("");
  };

  const handleUrlFocus = (e) => {
    e.target.select();
  };

  const handleEjemplarChange = (index, field, value) => {
    const nuevosEjemplares = [...ejemplares];
    nuevosEjemplares[index][field] = value;
    setEjemplares(nuevosEjemplares);
  };

  // Función para buscar libro por ISBN
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

  // FUNCIÓN DE VALIDACIÓN
  const validarFormulario = () => {
  let mensajeLibro = "";

  // Validar campos obligatorios del libro
  if (
    !nuevoLibro.titulo.trim() ||
    !nuevoLibro.autor.trim() ||
    !nuevoLibro.editorial.trim() ||
    !nuevoLibro.isbn.trim() ||
    !nuevoLibro.categoriaId.trim()
  ) {
    mensajeLibro += "Complete todos los campos obligatorios del libro (Título, Autor, Editorial, ISBN, Categoría).";
  }

  // Validar selección de donado/comprado
  if (nuevoLibro.donado === null || nuevoLibro.donado === undefined) {
    if (mensajeLibro) mensajeLibro += " ";
    mensajeLibro += "Seleccione si el libro es Donado o Comprado.";
  }

  // Validar precio si es comprado
  if (nuevoLibro.donado === false && (!nuevoLibro.precio || nuevoLibro.precio <= 0)) {
    if (mensajeLibro) mensajeLibro += " ";
    mensajeLibro += "Debe ingresar un precio estimado para los libros comprados.";
  }

  // Validar origen si es donado
  if (nuevoLibro.donado === true && (!nuevoLibro.origen || !nuevoLibro.origen.trim())) {
    if (mensajeLibro) mensajeLibro += " ";
    mensajeLibro += "Debe ingresar el origen del libro donado.";
  }

  // Mostrar mensaje de libro si hay errores
  if (mensajeLibro) {
    setValidationMessage(mensajeLibro);
    return false;
  }

  // Validar ejemplares
  const ejemplaresValidos = ejemplares.filter(
    (ejemplar) => ejemplar.codigo.trim() && ejemplar.ubicacion.trim()
  );
  if (ejemplaresValidos.length === 0) {
    setValidationMessage("Agregue al menos un ejemplar con código y ubicación completos.");
    return false;
  }

  // Si todo está bien
  setValidationMessage("");
  return true;
};

  const handleConfirmarAgregado = () => {
    if (!validarFormulario()) {
      setShowValidationError(true);
      setTimeout(() => {
        setShowValidationError(false);
      }, 5000);
      return;
    }

    setShowConfirmModal(true);
    setShowValidationError(false);
  };

  const handleAgregarConfirmado = () => {
    // Preparar datos para enviar a la API
    const libroParaEnviar = {
      ...nuevoLibro,
      categoriaId: nuevoLibro.categoriaId,
      ejemplares: ejemplares.map(ej => ({
        cdu: ej.codigo,
        ubicacionFisica: ej.ubicacion,
        estado: ej.estado.toLowerCase()
      }))
    };

    console.log("Nuevo libro para enviar:", libroParaEnviar);

    setShowConfirmModal(false);
    setShowSuccessToast(true);

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
                      <input
                        type="text"
                        name="isbn"
                        value={nuevoLibro.isbn}
                        onChange={handleChange}
                        onBlur={handleISBNBlur}
                        className={styles.formInput}
                        placeholder="Ingrese el ISBN"
                        required
                      />
                    </div>

                    {/* Categoría */}
                    <div className="col-12 col-md-6 mb-3">
                      <label className={styles.formLabel}>Categoría *</label>
                      <div className={styles.categoriaWrapper}>
                        <div className={styles.categoriaContainer}>
                          <select
                            value={nuevoLibro.categoriaId}
                            onChange={handleCategoriaChange}
                            className={styles.formInput}
                            required
                          >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.descripcion}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          className={styles.gestionarCategoriasBtn}
                          onClick={() => setShowGestionCategorias(true)}
                          title="Gestionar categorías"
                        >
                          <FiPlus className={styles.gestionarCategoriasIcon} />
                        </button>
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
                          Precio estimado {nuevoLibro.donado === false && "*"}
                        </label>
                        <div className="d-flex align-items-center gap-2">
                          {/* Input de Precio */}
                          <div className={styles.precioInputGroup} style={{ flex: 1 }}>
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
                              required={nuevoLibro.donado === false} // obligatorio solo si es comprado
                            />
                          </div>
                          
                        </div>
                      </div>

                       {/* Origen (solo si es Donado) */}
                  {nuevoLibro.donado === true && (
                    <div className={styles.origenInputGroup} style={{ flex: 1 }}>
                      <label className={styles.formLabel}>Origen del libro *</label>
                      <input
                        type="text"
                        name="origen"
                        value={nuevoLibro.origen || ""}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Ingrese el origen"
                        required
                      />
                    </div>
                  )}

                    {/* Selector Donado / Comprado */}
                          <div className={global.selectorDonacionContainer}>
                            <button
                              type="button"
                              onClick={() => setNuevoLibro({ ...nuevoLibro, donado: true })}
                              className={`${global.selectorBtn} ${nuevoLibro.donado === true ? global.selectorBtnDonadoActivo : ""}`}
                            >
                              📘 Donado
                            </button>

                            <button
                              type="button"
                              onClick={() => setNuevoLibro({ ...nuevoLibro, donado: false })}
                              className={`${global.selectorBtn} ${nuevoLibro.donado === false ? global.selectorBtnCompradoActivo : ""}`}
                            >
                              💰 Comprado
                            </button>
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

              {/* Modal de Gestión de Categorías */}
              {showGestionCategorias && (
                <div className={styles.modalBackdrop}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3 className={styles.modalTitle}>
                        {modoEdicion ? 'Editar Categoría' : 'Gestionar Categorías'}
                      </h3>
                      <button
                        className={styles.modalCloseBtn}
                        onClick={() => {
                          setShowGestionCategorias(false);
                          cancelarEdicion();
                        }}
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className={styles.modalBody}>
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
                        onClick={() => {
                          setShowGestionCategorias(false);
                          cancelarEdicion();
                        }}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                        <th>Edificio</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ejemplares.map((ejemplar, index) => (
                        <tr key={ejemplar.id}>
                          <td className="fw-bold">{index + 1}</td>

                           {/* Código */}

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

                          {/* Ubicación */}

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

                          {/* Edificio */}

                          <td>
                            <select
                              value={ejemplar.edificio || ""}
                              onChange={(e) =>
                                handleEjemplarChange(index, "edificio", e.target.value)
                              }
                              className={styles.tablaSelect}
                            >
                              <option value="">Seleccione</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          </td>

                          {/* Estado */}

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

                          {/* Acción */}

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
                  Categoría: {getCategoriaSeleccionada()?.descripcion || "No seleccionada"}
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