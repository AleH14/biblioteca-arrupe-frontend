"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "../../styles/Usuarios.module.css";
import global from "../../styles/Global.module.css";
import { FiHome, FiEdit, FiTrash2, FiX, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

// Colores según rol
const rolColor = {
  "Bibliotecario": { border: "#FF0004" },
  "Administrativo": { border: "#00C8FF" },
  "Colaborador": { border: "#0F52BA" },
  "Estudiante": { border: "#9370db" }
};

// Usuarios iniciales
const usuariosData = [
  { id: 1, nombre: "René Abarca", rol: "Bibliotecario", email: "rene@fundacionpadrearrupe.org", telefono: "7788-6625", fecha: "12/10/2024", password: "123456" },
  { id: 2, nombre: "Luis Rivas", rol: "Administrativo", email: "lrivas@fundacionpadrearrupe.org", telefono: "7688-6625", fecha: "12/10/2024", password: "admin2024" },
  { id: 3, nombre: "Carla Méndez", rol: "Colaborador", email: "carla@fundacionpadrearrupe.org", telefono: "7777-1234", fecha: "15/10/2024", password: "carla123" },
  { id: 4, nombre: "Jorge López", rol: "Estudiante", email: "jorge@fundacionpadrearrupe.org", telefono: "7666-4321", fecha: "20/10/2024", password: "jorgepass" },
];

const roles = ["Todos", "Bibliotecario", "Administrativo", "Colaborador", "Estudiante"];

// ===== COMPONENTES =====

// Toast Notification
const Toast = React.memo(({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[`toast${type}`]}`}>
      <div className={styles.toastContent}>
        <FiCheck className={styles.toastIcon} />
        <span>{message}</span>
      </div>
      <button className={styles.toastClose} onClick={onClose}>
        <FiX size={16} />
      </button>
    </div>
  );
});

// Modal genérico
const ModalGenerico = React.memo(({ isOpen, onClose, titulo, children, footer }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{titulo}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
});

// Tarjeta de usuario
const TarjetaUsuario = React.memo(({ usuario, onEditar, onEliminar }) => {
  const color = rolColor[usuario?.rol] || { border: "#ccc" };
  return (
    <div className={styles.card} style={{ borderTop: `5px solid ${color.border}`, position: "relative" }}>
      <div className={styles.rolBadge} style={{ backgroundColor: color.border }}>{usuario?.rol}</div>
      <div className={styles.loanInfo}>
        <strong>{usuario?.nombre}</strong><br />
        <small>{usuario?.email}</small><br />
        <small>{usuario?.telefono}</small><br />
        <small className={styles.fecha}>Registrado: {usuario?.fecha}</small>
      </div>
      <div className="d-flex gap-3 mt-3 justify-content-end">
        <FiEdit className={styles.iconAction} title="Editar usuario" onClick={() => onEditar(usuario)} />
        <FiTrash2 className={styles.iconAction} title="Eliminar usuario" onClick={() => onEliminar(usuario)} />
      </div>
    </div>
  );
});

// Filtro lateral
const FilterPanel = React.memo(({ filtroActivo, setFiltroActivo }) => (
  <div className={styles.sidebarPanel}>
    <div className={styles.filterSection}>
      <label className={styles.filterLabel}>Categorías</label>
      <div className={styles.filterButtons}>
        {roles.map((rol) => {
          const nombreMostrar =
            rol === "Todos" ? "Todos" : rol === "Colaborador" ? "Colaboradores" : rol + "s";
          return (
            <button
              key={rol}
              className={`${styles.filterBtn} ${filtroActivo === rol ? styles.filterBtnActive : ""}`}
              onClick={() => setFiltroActivo(rol)}
            >
              {nombreMostrar}
            </button>
          );
        })}
      </div>
    </div>
  </div>
));

// Buscador
const SearchSection = React.memo(({ terminoBusqueda, setTerminoBusqueda, onAgregar }) => (
  <div className={styles.searchSection}>
    <div className="d-flex gap-2 flex-column flex-md-row">
      <input
        type="text"
        placeholder="Buscar usuario"
        className={`${styles.searchInput} flex-grow-1`}
        value={terminoBusqueda}
        onChange={(e) => setTerminoBusqueda(e.target.value)}
      />
      <button className={global.btnPrimary} onClick={onAgregar}>
        <span className={global.btnPrimaryMas}>+</span> Agregar Usuario
      </button>
    </div>
  </div>
));

// Home + Logout
const HeaderActions = React.memo(({ onHomeClick, onLogoutClick }) => (
  <div className="d-flex justify-content-between align-items-center w-100">
    <button className={global.homeBtn} onClick={onHomeClick} title="Inicio">
      <FiHome className={global.homeIcon} />
    </button>
    <button className={global.logoutBtn} onClick={onLogoutClick} title="Cerrar sesión">
      <MdLogout className={global.logoutIcon} />
      <span>Cerrar sesión</span>
    </button>
  </div>
));

// ===== COMPONENTE PRINCIPAL =====
export default function Usuarios({ volverMenu }) {
  const [usuarios, setUsuarios] = useState(usuariosData);
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const [usuarioSel, setUsuarioSel] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });
  const [formData, setFormData] = useState({ nombre: "", email: "", telefono: "", rol: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Filtrado con useMemo para evitar recalculos innecesarios
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideFiltro = filtroActivo === "Todos" || u.rol === filtroActivo;
      const coincideBusqueda =
        !terminoBusqueda.trim() ||
        u.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        u.telefono.includes(terminoBusqueda);
      return coincideFiltro && coincideBusqueda;
    });
  }, [usuarios, filtroActivo, terminoBusqueda]);

  // Modal
  const abrirModal = useCallback((tipo, usuario = null) => {
    setUsuarioSel(usuario);
    setModal(tipo);
  }, []);
  const cerrarModal = useCallback(() => {
    setModal(null);
    setUsuarioSel(null);
  }, []);

  // Toast
  const mostrarToast = useCallback((msg, type = "success") => setToast({ isVisible: true, message: msg, type }), []);
  const cerrarToast = useCallback(() => setToast(prev => ({ ...prev, isVisible: false })), []);

  // Formulario
  useEffect(() => {
    if (modal === "editar" && usuarioSel) setFormData({ ...usuarioSel, password: usuarioSel.password });
    if (modal === "agregar") setFormData({ nombre: "", email: "", telefono: "", rol: "", password: "" });
    setErrors({});
    setShowPassword(false);
  }, [modal, usuarioSel]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "telefono") {
      val = value.replace(/\D/g, "");
      if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4, 8);
    }
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  }, [errors]);

  const validar = useCallback(() => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "El email es requerido";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Formato inválido";
    const telRegex = /^\d{4}-\d{4}$/;
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es requerido";
    else if (!telRegex.test(formData.telefono)) newErrors.telefono = "Formato ####-####";
    if (!formData.rol) newErrors.rol = "El rol es requerido";

    if (modal === "agregar" && !formData.password.trim()) newErrors.password = "La contraseña es requerida";
    else if (formData.password && formData.password.length < 6) newErrors.password = "Mínimo 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, modal]);

  const guardarUsuario = useCallback(() => {
    if (!validar()) return;
    if (modal === "agregar") {
      setUsuarios(prev => [...prev, { ...formData, id: Date.now(), fecha: new Date().toLocaleDateString() }]);
      mostrarToast("Usuario agregado correctamente");
    } else if (modal === "editar") {
      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuarioSel.id
            ? { ...u, ...formData, password: formData.password || u.password }
            : u
        )
      );
      mostrarToast("Usuario actualizado correctamente");
    }
    cerrarModal();
  }, [formData, modal, usuarioSel, validar, mostrarToast, cerrarModal]);

  const eliminarUsuario = useCallback(() => {
    setUsuarios(prev => prev.filter(u => u.id !== usuarioSel.id));
    cerrarModal();
  }, [usuarioSel, cerrarModal]);

  const handleLogout = useCallback(() => console.log("Cerrar sesión"), []);

  return (
    <div className={global.backgroundWrapper}>
      <Toast {...toast} onClose={cerrarToast} />
      <header className={`${global.header} d-flex justify-content-between align-items-center`}>
        <HeaderActions onHomeClick={volverMenu} onLogoutClick={handleLogout} />
      </header>

      <div className="container text-center mb-4">
        <h1 className={global.title}>USUARIOS</h1>
      </div>

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-3 col-lg-2 mb-4">
            <FilterPanel filtroActivo={filtroActivo} setFiltroActivo={setFiltroActivo} />
          </div>
          <div className="col-12 col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              <SearchSection terminoBusqueda={terminoBusqueda} setTerminoBusqueda={setTerminoBusqueda} onAgregar={() => abrirModal("agregar")} />

              <div className={styles.loansListContainer}>
                <div className={styles.loansList} style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {usuariosFiltrados.map(u => (
                    <TarjetaUsuario key={u.id} usuario={u} onEditar={() => abrirModal("editar", u)} onEliminar={() => abrirModal("eliminar", u)} />
                  ))}
                  {usuariosFiltrados.length === 0 && (
                    <div className={styles.noResults}><p>No se encontraron usuarios</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agregar/Editar */}
      <ModalGenerico
        isOpen={modal === "agregar" || modal === "editar"}
        onClose={cerrarModal}
        titulo={modal === "agregar" ? "Agregar Usuario" : "Editar Usuario"}
        footer={
          <div className="d-flex justify-content-end gap-2">
            <button className={global.btnSecondary} onClick={cerrarModal}>Cancelar</button>
            <button className={global.btnWarning} onClick={guardarUsuario}>{modal === "agregar" ? "Agregar" : "Guardar"}</button>
          </div>
        }
      >
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre completo</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={errors.nombre ? styles.inputError : styles.lightInput} />
            {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? styles.inputError : styles.lightInput} />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="####-####" maxLength={9} className={errors.telefono ? styles.inputError : styles.lightInput} />
            {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Rol</label>
            <select name="rol" value={formData.rol} onChange={handleChange} className={errors.rol ? styles.inputError : styles.lightInput}>
              <option value="">Seleccionar rol</option>
              <option value="Bibliotecario">Bibliotecario</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Colaborador">Colaborador</option>
              <option value="Estudiante">Estudiante</option>
            </select>
            {errors.rol && <span className={styles.errorText}>{errors.rol}</span>}
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles.inputError : styles.lightInput}
              />
              <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>
        </div>
      </ModalGenerico>

      {/* Modal eliminar */}
      <ModalGenerico
        isOpen={modal === "eliminar"}
        onClose={cerrarModal}
        titulo="ELIMINAR USUARIO"
        footer={
          <div className="d-flex justify-content-center gap-2">
            <button className={global.btnSecondary} onClick={eliminarUsuario}>Eliminar</button>
          </div>
        }
      >
        <p className={styles.deleteText}>¿Seguro que deseas eliminar a <b>{usuarioSel?.nombre}</b>?</p>
        <p className={styles.deleteWarning}>Esta acción no se puede deshacer.</p>
      </ModalGenerico>
    </div>
  );
}
