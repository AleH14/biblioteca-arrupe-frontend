import React, { useState, useCallback, memo } from "react";
import DatePicker from "react-datepicker";
import styles from "../../styles/PrestamoVista.module.css";
import global from "../../styles/Global.module.css";

// COMPONENTES MEMOIZADOS INDIVIDUALES - No se rerenderizan innecesariamente
const TipoUsuarioRadio = memo(({ value, checked, onChange, label, id, hasError }) => (
  <div className="form-check form-check-inline">
    <input
      className={`form-check-input ${hasError ? 'is-invalid' : ''}`}
      type="radio"
      name="tipoUsuario"
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label" htmlFor={id}>
      {label}
    </label>
  </div>
));

TipoUsuarioRadio.displayName = 'TipoUsuarioRadio';

const EjemplarInput = memo(({ 
  value, 
  index, 
  onChange, 
  onRemove, 
  showRemove, 
  hasError 
}) => (
  <div className="mb-3 d-flex">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      className={`${styles.inputForm} form-control me-2 ${
        hasError ? styles.inputError : ""
      }`}
      placeholder="Ingrese el ejemplar"
      required
    />
    {showRemove && (
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => onRemove(index)}
      >
        &times;
      </button>
    )}
  </div>
));

EjemplarInput.displayName = 'EjemplarInput';

const NuevoPrestamoModal = memo(({
  show,
  onClose,
  formData,
  onInputChange,
  errores,
  ejemplaresSeleccionados,
  onEjemplarChange,
  onAddEjemplar,
  onRemoveEjemplar,
  fechaPrestamo,
  onFechaPrestamoChange,
  fechaDevolucion,
  onFechaDevolucionChange,
  onGuardar,
  guardando,
}) => {
  // Estado local para manejar cambios sin afectar el padre inmediatamente
  const [localFormData, setLocalFormData] = useState(formData);
  const [localEjemplares, setLocalEjemplares] = useState(ejemplaresSeleccionados);
  
  //  Sincronizar cuando cambian las props externas (solo cuando show cambia)
  React.useEffect(() => {
    if (show) {
      setLocalFormData(formData);
      setLocalEjemplares(ejemplaresSeleccionados);
    }
  }, [show, formData.usuarioId, ejemplaresSeleccionados.length]); // Solo dependencias críticas

  //  Handlers locales memoizados
  const handleTipoUsuarioChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalFormData(prev => ({ ...prev, tipoUsuario: newValue }));
    // Notificar al padre solo cuando sea necesario
    onInputChange({
      target: {
        name: "tipoUsuario",
        value: newValue,
      },
    });
  }, [onInputChange]);

  const handleUsuarioIdChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalFormData(prev => ({ ...prev, usuarioId: newValue }));
    onInputChange(e);
  }, [onInputChange]);

  const handleLocalEjemplarChange = useCallback((index, value) => {
    setLocalEjemplares(prev => {
      const newEjemplares = [...prev];
      newEjemplares[index] = value;
      return newEjemplares;
    });
    onEjemplarChange(index, value);
  }, [onEjemplarChange]);

  const handleLocalAddEjemplar = useCallback(() => {
    setLocalEjemplares(prev => [...prev, ""]);
    onAddEjemplar();
  }, [onAddEjemplar]);

  const handleLocalRemoveEjemplar = useCallback((index) => {
    setLocalEjemplares(prev => prev.filter((_, i) => i !== index));
    onRemoveEjemplar(index);
  }, [onRemoveEjemplar]);

  const handleFechaPrestamoChange = useCallback((date) => {
    onFechaPrestamoChange(date);
  }, [onFechaPrestamoChange]);

  const handleFechaDevolucionChange = useCallback((date) => {
    onFechaDevolucionChange(date);
  }, [onFechaDevolucionChange]);

  const handleGuardar = useCallback(() => {
    onGuardar();
  }, [onGuardar]);

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
                  Tipo de Usuario <span className="text-danger">*</span>
                </label>
                <div>
                  <TipoUsuarioRadio
                    value="estudiante"
                    checked={localFormData.tipoUsuario === 'estudiante'}
                    onChange={handleTipoUsuarioChange}
                    label="Estudiante"
                    id="estudiante"
                    hasError={!!errores.tipoUsuario}
                  />
                  <TipoUsuarioRadio
                    value="docente"
                    checked={localFormData.tipoUsuario === 'docente'}
                    onChange={handleTipoUsuarioChange}
                    label="Docente"
                    id="docente"
                    hasError={!!errores.tipoUsuario}
                  />
                </div>
                {errores.tipoUsuario && (
                  <div className={`${styles.errorMessage} mt-1`}>
                    {errores.tipoUsuario}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre</label>
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

              <label className="form-label">Ejemplar</label>
              {errores.ejemplares && (
                <div className={styles.errorMessage}>
                  {errores.ejemplares}
                </div>
              )}
              <br />
              {localEjemplares.map((ej, index) => (
                <EjemplarInput
                  key={index}
                  value={ej}
                  index={index}
                  onChange={handleLocalEjemplarChange}
                  onRemove={handleLocalRemoveEjemplar}
                  showRemove={localEjemplares.length > 1}
                  hasError={!!errores.ejemplares}
                />
              ))}
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={handleLocalAddEjemplar}
              >
                + Añadir otro Ejemplar
              </button>

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
});

NuevoPrestamoModal.displayName = "NuevoPrestamoModal";

export default NuevoPrestamoModal;