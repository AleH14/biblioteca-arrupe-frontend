"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import styles from "../../../styles/Usuarios.module.css";
import global from "../../../styles/Global.module.css";
import { useDebounce } from "../../../hooks/useDebounce";

// Memoizamos iconos para optimizar renders
const IconoCerrar = memo(({ onClick }) => <FiX onClick={onClick} />);
const IconoMostrar = memo(({ mostrar, onClick }) =>
  mostrar ? <FiEyeOff onClick={onClick} /> : <FiEye onClick={onClick} />
);

const UsuarioModal = ({ isOpen, onClose, onGuardar, usuario, title, submitText }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    rol: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [tempNombre, setTempNombre] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempTelefono, setTempTelefono] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const debouncedNombre = useDebounce(tempNombre, 300);
  const debouncedEmail = useDebounce(tempEmail, 300);
  const debouncedTelefono = useDebounce(tempTelefono, 300);
  const debouncedPassword = useDebounce(tempPassword, 300);

  // Sincroniza valores debounced con formData
  useEffect(() => setFormData(prev => ({ ...prev, nombre: debouncedNombre })), [debouncedNombre]);
  useEffect(() => setFormData(prev => ({ ...prev, email: debouncedEmail })), [debouncedEmail]);
  useEffect(() => setFormData(prev => ({ ...prev, telefono: debouncedTelefono })), [debouncedTelefono]);
  useEffect(() => setFormData(prev => ({ ...prev, password: debouncedPassword })), [debouncedPassword]);

  // Inicializa formulario al abrir el modal
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || "",
        password: usuario.password || "",
      });
      setTempNombre(usuario.nombre || "");
      setTempEmail(usuario.email || "");
      setTempTelefono(usuario.telefono || "");
      setTempPassword(usuario.password || "");
      setShowPassword(false);
      setErrors({});
    } else {
      // Si es agregar, resetear todo
      setFormData({
        nombre: "",
        rol: "",
        email: "",
        telefono: "",
        password: "",
      });
      setTempNombre("");
      setTempEmail("");
      setTempTelefono("");
      setTempPassword("");
      setShowPassword(false);
      setErrors({});
    }
  }, [usuario, isOpen]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) nuevosErrores.email = "El email es requerido";
    else if (!emailRegex.test(formData.email)) nuevosErrores.email = "Formato de email no válido";

    const telefonoRegex = /^\d{4}-\d{4}$/;
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido";
    else if (!telefonoRegex.test(formData.telefono)) nuevosErrores.telefono = "Formato debe ser ####-####";

    if (!formData.rol) nuevosErrores.rol = "El rol es requerido";

    if (!formData.password.trim()) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else {
      const password = formData.password;
      const minLength = 8;
      const mayuscula = /[A-Z]/;
      const minuscula = /[a-z]/;
      const numero = /[0-9]/;
      const especial = /[!@#$%^&*(),.?":{}|<>]/;

      if (password.length < minLength) nuevosErrores.password = `Debe tener al menos ${minLength} caracteres`;
      else if (!mayuscula.test(password)) nuevosErrores.password = "Debe incluir al menos una letra mayúscula";
      else if (!minuscula.test(password)) nuevosErrores.password = "Debe incluir al menos una letra minúscula";
      else if (!numero.test(password)) nuevosErrores.password = "Debe incluir al menos un número";
      else if (!especial.test(password)) nuevosErrores.password = "Debe incluir al menos un carácter especial";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (name, value) => {
    switch (name) {
      case "telefono":
        let formattedValue = value.replace(/\D/g, "");
        if (formattedValue.length > 4) formattedValue = formattedValue.slice(0, 4) + "-" + formattedValue.slice(4, 8);
        setTempTelefono(formattedValue);
        break;
      case "nombre":
        setTempNombre(value);
        break;
      case "email":
        setTempEmail(value);
        break;
      case "password":
        setTempPassword(value);
        break;
      case "rol":
        setFormData(prev => ({ ...prev, rol: value }));
        break;
      default:
        break;
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const toggleShowPassword = useCallback(() => setShowPassword(prev => !prev), []);

  const handleCerrar = useCallback(() => {
    onClose();
    setErrors({});
    setShowPassword(false);
    setFormData({ nombre: "", rol: "", email: "", telefono: "", password: "" });
    setTempNombre("");
    setTempEmail("");
    setTempTelefono("");
    setTempPassword("");
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar({ ...formData, id: usuario?.id });
      handleCerrar();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.closeButton}><IconoCerrar onClick={handleCerrar} /></button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className={styles.formGroup}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Escriba nombre de usuario"
              value={tempNombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className={errors.nombre ? styles.inputError : styles.lightInput}
            />
            {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@ejemplo.com"
              value={tempEmail}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? styles.inputError : styles.lightInput}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {/* Teléfono */}
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={tempTelefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              placeholder="####-####"
              maxLength={9}
              className={errors.telefono ? styles.inputError : styles.lightInput}
            />
            {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}
          </div>

          {/* Contraseña */}
          <div className={styles.formGroup + " " + styles.passwordContainer}>
            <label>Contraseña</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={tempPassword}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Ingrese contraseña"
                className={errors.password ? styles.inputError : styles.lightInput}
              />
              <button type="button" className={styles.togglePassword}>
                <IconoMostrar mostrar={showPassword} onClick={toggleShowPassword} />
              </button>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          {/* Rol */}
          <div className={styles.formGroup}>
            <label>Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={(e) => handleChange("rol", e.target.value)}
              className={errors.rol ? styles.inputError : styles.lightInput}
            >
              <option value="">Seleccionar rol</option>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
              <option value="consultor">Consultor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.rol && <span className={styles.errorText}>{errors.rol}</span>}
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={global.btnSecondary} onClick={handleCerrar}>
              Cancelar
            </button>
            <button type="submit" className={global.btnPrimary}>
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;
