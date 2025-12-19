import React, { useState, useCallback, memo } from "react";
import DatePicker from "react-datepicker";
import BusquedaLibroInput from "./BusquedaLibroInput";
import styles from "../../../styles/PrestamoVista.module.css";
import global from "../../../styles/Global.module.css";

// COMPONENTES MEMOIZADOS INDIVIDUALES - No se rerenderizan innecesariamente
const TipoPrestamoRadio = memo(
  ({ value, checked, onChange, label, id, hasError }) => (
    <div className="form-check form-check-inline">
      <input
        className={`form-check-input ${hasError ? "is-invalid" : ""}`}
        type="radio"
        name="tipoPrestamo"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
);

TipoPrestamoRadio.displayName = "TipoPrestamoRadio";

const NuevoPrestamoModal = memo(
  ({
    show,
    onClose,
    formData,
    onInputChange,
    errores,
    buscarLibros,
    buscarUsuarios,
    fechaPrestamo,
    onFechaPrestamoChange,
    fechaDevolucion,
    onFechaDevolucionChange,
    onGuardar,
    guardando,
  }) => {
    // Estado local para manejar la selección de libro y ejemplar
    const [localFormData, setLocalFormData] = useState(formData);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState(null);

    //  Sincronizar cuando cambian las props externas (solo cuando show cambia)
    React.useEffect(() => {
      if (show) {
        setLocalFormData(formData);
        setLibroSeleccionado(null);
        setEjemplarSeleccionado(null);
      }
    }, [show]);

    //  Handlers locales memoizados
    const handleTipoPrestamoChange = useCallback(
      (e) => {
        const newValue = e.target.value;
        setLocalFormData((prev) => ({ ...prev, tipoPrestamo: newValue }));
        onInputChange({
          target: {
            name: "tipoPrestamo",
            value: newValue,
          },
        });
      },
      [onInputChange]
    );

    const handleUsuarioIdChange = useCallback(
      (e) => {
        const newValue = e.target.value;
        setLocalFormData((prev) => ({ ...prev, usuarioId: newValue }));
        onInputChange(e);
      },
      [onInputChange]
    );

    const handleLibroSeleccionado = useCallback((libro) => {
      setLibroSeleccionado(libro);
      setEjemplarSeleccionado(null); // Limpiar ejemplar cuando cambia el libro
    }, []);

    const handleEjemplarSeleccionado = useCallback((ejemplar) => {
      setEjemplarSeleccionado(ejemplar);
    }, []);

    const handleFechaPrestamoChange = useCallback(
      (date) => {
        onFechaPrestamoChange(date);
      },
      [onFechaPrestamoChange]
    );

    const handleFechaDevolucionChange = useCallback(
      (date) => {
        onFechaDevolucionChange(date);
      },
      [onFechaDevolucionChange]
    );

    const handleGuardar = useCallback(() => {
      // Enviar datos al padre incluyendo libro y ejemplar seleccionados
      onGuardar({
        ...localFormData,
        libroSeleccionado,
        ejemplarSeleccionado,
      });
    }, [onGuardar, localFormData, libroSeleccionado, ejemplarSeleccionado]);

    if (!show) return null;

    return (
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nuevo Préstamo</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label">
                    Tipo de Préstamo <span className="text-danger">*</span>
                  </label>
                  <div>
                    <TipoPrestamoRadio
                      value="estudiante"
                      checked={localFormData.tipoPrestamo === "estudiante"}
                      onChange={handleTipoPrestamoChange}
                      label="Estudiante"
                      id="estudiante"
                      hasError={!!errores.tipoPrestamo}
                    />
                    <TipoPrestamoRadio
                      value="docente"
                      checked={localFormData.tipoPrestamo === "docente"}
                      onChange={handleTipoPrestamoChange}
                      label="Docente"
                      id="docente"
                      hasError={!!errores.tipoPrestamo}
                    />
                    <TipoPrestamoRadio
                      value="otro"
                      checked={localFormData.tipoPrestamo === "otro"}
                      onChange={handleTipoPrestamoChange}
                      label="Otro"
                      id="otro"
                      hasError={!!errores.tipoPrestamo}
                    />
                  </div>
                  {errores.tipoPrestamo && (
                    <div className={`${styles.errorMessage} mt-1`}>
                      {errores.tipoPrestamo}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre del Usuario</label>
                  <input
                    type="text"
                    name="usuarioId"
                    value={localFormData.usuarioId}
                    onChange={handleUsuarioIdChange}
                    className={`${styles.inputForm} form-control ${
                      errores.usuarioId ? styles.inputError : ""
                    }`}
                    placeholder="Ingrese el nombre del usuario"
                    required
                  />
                  {errores.usuarioId && (
                    <div className={styles.errorMessage}>
                      {errores.usuarioId}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Buscar Libro <span className="text-danger">*</span>
                  </label>
                  <BusquedaLibroInput
                    onLibroSeleccionado={handleLibroSeleccionado}
                    onEjemplarSeleccionado={handleEjemplarSeleccionado}
                    buscarLibros={buscarLibros}
                    hasError={!!errores.libro}
                  />
                  {errores.libro && (
                    <div className={styles.errorMessage}>
                      {errores.libro}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Fecha de Préstamo</label>
                  <DatePicker
                    selected={fechaPrestamo}
                    onChange={handleFechaPrestamoChange}
                    className={`${styles.datePickerInput} form-control ${
                      errores.fechaPrestamo ? styles.inputError : ""
                    }`}
                    placeholderText="Selecciona fecha"
                    dateFormat="yyyy-MM-dd"
                    required
                  />
                  {errores.fechaPrestamo && (
                    <div className={styles.errorMessage}>
                      {errores.fechaPrestamo}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Fecha de Devolución Estimada
                  </label>
                  <DatePicker
                    selected={fechaDevolucion}
                    onChange={handleFechaDevolucionChange}
                    minDate={fechaPrestamo}
                    className={`${styles.datePickerInput} form-control ${
                      errores.fechaDevolucion ? styles.inputError : ""
                    }`}
                    placeholderText="Selecciona fecha"
                    dateFormat="yyyy-MM-dd"
                    required
                  />
                  {errores.fechaDevolucion && (
                    <div className={styles.errorMessage}>
                      {errores.fechaDevolucion}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className={`${global.btnPrimary} ${
                    guardando ? styles.loading : ""
                  }`}
                  onClick={handleGuardar}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar Préstamo"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

NuevoPrestamoModal.displayName = "NuevoPrestamoModal";

export default NuevoPrestamoModal;
