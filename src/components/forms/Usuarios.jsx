"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/Usuarios.module.css";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { FiEdit, FiTrash2, FiX, FiCheck } from "react-icons/fi";

// Datos y configuración
const rolColor = {
  "Bibliotecario": { border: "#FF0004" },
  "Administrativo": { border: "#00C8FF" },
  "Colaborador": { border: "#0F52BA" },
  "Estudiante": { border: "#9370db" }
};

const usuariosData = [
  { id: 1, nombre: "René Abarca", rol: "Bibliotecario", email: "rene@fundacionpadrearrupe.org", telefono: "7788-6625", fecha: "12/10/2024" },
  { id: 2, nombre: "Luis Rivas", rol: "Administrativo", email: "lrivas@fundacionpadrearrupe.org", telefono: "7688-6625", fecha: "12/10/2024" },
  { id: 3, nombre: "Carla Méndez", rol: "Colaborador", email: "carla@fundacionpadrearrupe.org", telefono: "7777-1234", fecha: "15/10/2024" },
  { id: 4, nombre: "Jorge López", rol: "Estudiante", email: "jorge@fundacionpadrearrupe.org", telefono: "7666-4321", fecha: "20/10/2024" }
];

const roles = ["Todos", "Bibliotecario", "Administrativo", "Colaborador", "Estudiante"];

// Componente Toast para notificaciones
const Toast = ({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-cerrar después de 3 segundos

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
};

// Componente Modal Base
const Modal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={`${styles.modalContent} ${className}`}>
        {children}
      </div>
    </div>
  );
};

// Componente Modal de Edición
const ModalEditarUsuario = ({ usuario, isOpen, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: "", 
    rol: "", 
    email: "", 
    telefono: ""
  });
  const [errors, setErrors] = useState({});

  // useEffect para cargar datos cuando cambia el usuario o se abre el modal
  useEffect(() => {
    if (usuario && isOpen) {
      setFormData({
        nombre: usuario.nombre || "",
        rol: usuario.rol || "",
        email: usuario.email || "",
        telefono: usuario.telefono || ""
      });
    }
  }, [usuario, isOpen]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) nuevosErrores.email = "El email es requerido";
    else if (!emailRegex.test(formData.email)) nuevosErrores.email = "El formato del email no es válido";
    
    const telefonoRegex = /^\d{4}-\d{4}$/;
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido";
    else if (!telefonoRegex.test(formData.telefono)) nuevosErrores.telefono = "El formato debe ser ####-####";
    
    if (!formData.rol) nuevosErrores.rol = "El rol es requerido";
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "telefono") {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.slice(0, 4) + '-' + formattedValue.slice(4, 8);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) onGuardar(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3>Editar Usuario</h3>
        <button className={styles.closeButton} onClick={onClose}><FiX size={20} /></button>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nombre completo</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            className={errors.nombre ? styles.inputError : styles.lightInput} 
          />
          {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={errors.email ? styles.inputError : styles.lightInput} 
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Teléfono</label>
          <input 
            type="text" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            placeholder="####-####" 
            maxLength="9" 
            className={errors.telefono ? styles.inputError : styles.lightInput} 
          />
          {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Rol</label>
          <select 
            name="rol" 
            value={formData.rol} 
            onChange={handleChange} 
            className={errors.rol ? styles.inputError : styles.lightInput}
          >
            <option value="">Seleccionar rol</option>
            <option value="Bibliotecario">Bibliotecario</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Colaborador">Colaborador</option>
            <option value="Estudiante">Estudiante</option>
          </select>
          {errors.rol && <span className={styles.errorText}>{errors.rol}</span>}
        </div>
        
        <div className={styles.modalActions}>
          <button type="button" className={global.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={global.btnWarning}>Guardar Cambios</button>
        </div>
      </form>
    </Modal>
  );
};

// Componente Modal de Agregar Usuario
const ModalAgregarUsuario = ({ isOpen, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({ nombre: "", rol: "", email: "", telefono: "" });
  const [errors, setErrors] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) nuevosErrores.email = "El email es requerido";
    else if (!emailRegex.test(formData.email)) nuevosErrores.email = "El formato del email no es válido";
    
    const telefonoRegex = /^\d{4}-\d{4}$/;
    if (!formData.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido";
    else if (!telefonoRegex.test(formData.telefono)) nuevosErrores.telefono = "El formato debe ser ####-####";
    
    if (!formData.rol) nuevosErrores.rol = "El rol es requerido";
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "telefono") {
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.slice(0, 4) + '-' + formattedValue.slice(4, 8);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const nuevoUsuario = { ...formData, id: Date.now(), fecha: new Date().toLocaleDateString() };
      onGuardar(nuevoUsuario);
      setFormData({ nombre: "", rol: "", email: "", telefono: "" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3>Agregar Usuario</h3>
        <button className={styles.closeButton} onClick={onClose}><FiX size={20} /></button>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Nombre completo</label>
          <input 
            type="text" 
            name="nombre" 
            placeholder="Escriba nombre de usuario" 
            value={formData.nombre} 
            onChange={handleChange} 
            className={errors.nombre ? styles.inputError : styles.lightInput} 
          />
          {errors.nombre && <span className={styles.errorText}>{errors.nombre}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="ejemplo@ejemplo.com" 
            value={formData.email} 
            onChange={handleChange} 
            className={errors.email ? styles.inputError : styles.lightInput} 
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Teléfono</label>
          <input 
            type="text" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            placeholder="####-####" 
            maxLength="9" 
            className={errors.telefono ? styles.inputError : styles.lightInput} 
          />
          {errors.telefono && <span className={styles.errorText}>{errors.telefono}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Rol</label>
          <select 
            name="rol" 
            value={formData.rol} 
            onChange={handleChange} 
            className={errors.rol ? styles.inputError : styles.lightInput}
          >
            <option value="">Seleccionar rol</option>
            <option value="Bibliotecario">Bibliotecario</option>
            <option value="Administrativo">Administrativo</option>
            <option value="Colaborador">Colaborador</option>
            <option value="Estudiante">Estudiante</option>
          </select>
          {errors.rol && <span className={styles.errorText}>{errors.rol}</span>}
        </div>
        
        <div className={styles.modalActions}>
          <button type="button" className={global.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={global.btnPrimary}>Agregar Usuario</button>
        </div>
      </form>
    </Modal>
  );
};

// Componente Modal de Confirmación de Eliminación
const ModalConfirmarEliminar = ({ isOpen, onClose, onConfirm, usuario }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalHeader}>
        <h3 className={styles.deleteTitle}>ELIMINAR USUARIO</h3>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
      </div>

      <div className={styles.modalBody}>
        <p className={styles.deleteText}>¿Seguro que deseas eliminar a <b>{usuario?.nombre}</b>?</p>
        <p className={styles.deleteWarning}>Esta acción no se puede deshacer.</p>
      </div>

      <div className={styles.modalFooter}>
        <div className="d-flex justify-content-center gap-2">
          <button className={global.btnSecondary} onClick={() => onConfirm()}>Eliminar</button>
        </div>
      </div>
    </Modal>
  );
};

// Componente Tarjeta de Usuario
const TarjetaUsuario = ({ usuario, onEditar, onEliminar }) => {
  const color = rolColor[usuario.rol];
  
  return (
    <div className={styles.card} style={{ borderTop: `5px solid ${color.border}` }}>
      <div className={styles.rolBadge} style={{ backgroundColor: color.border }}>
        {usuario.rol}
      </div>
 
      <div className={styles.loanInfo}>
        <strong>{usuario.nombre}</strong>
        <br />
        <small>{usuario.email}</small>
        <br />
        <small>{usuario.telefono}</small>
        <br />
        <small className={styles.fecha}>Registrado: {usuario.fecha}</small>
      </div>

      <div className="d-flex gap-3 mt-3 justify-content-end">
        <FiEdit 
          className={styles.iconAction} 
          title="Editar usuario" 
          onClick={() => onEditar(usuario)}
        />
        <FiTrash2 
          className={styles.iconAction} 
          title="Eliminar usuario" 
          onClick={() => onEliminar(usuario)}
        />
      </div>
    </div>
  );
};

// Componente Principal
export default function Usuarios({ volverMenu }) {
  const [usuarios, setUsuarios] = useState(usuariosData);
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideFiltro = filtroActivo === "Todos" || usuario.rol === filtroActivo;
    const coincideBusqueda = !terminoBusqueda.trim() || 
      usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.telefono.includes(terminoBusqueda);
    return coincideFiltro && coincideBusqueda;
  });

  // Control de modales
  const abrirModal = (tipoModal, usuario = null) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(tipoModal);
  };

  const cerrarModales = () => {
    setModalAbierto(null);
    setUsuarioSeleccionado(null);
  };

  // Mostrar toast
  const mostrarToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const cerrarToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Operaciones CRUD
  const guardarUsuarioEditado = (datosEditados) => {
    setUsuarios(prev => prev.map(usuario => 
      usuario.id === usuarioSeleccionado.id ? { ...usuario, ...datosEditados } : usuario
    ));
    mostrarToast("Usuario actualizado correctamente", "success");
    cerrarModales();
  };

  const agregarUsuario = (nuevoUsuario) => {
    setUsuarios(prev => [...prev, nuevoUsuario]);
    mostrarToast("Usuario agregado correctamente", "success");
    cerrarModales();
  };

  const eliminarUsuario = () => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioSeleccionado.id));
    cerrarModales();
  };

  return (
    <div className={global.backgroundWrapper}>
      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={cerrarToast}
      />

      {/* Header */}
      <header className={`${global.header} d-flex justify-content-between align-items-center`}>
        <button className={global.homeBtn} onClick={volverMenu}>
          <FiHome className={global.homeIcon} />
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Título */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img src="/images/complemento-1.png" alt="Complemento" className={global.complementoImg + " me-2"} />
              <h1 className={`${global.title} mb-0`}>USUARIOS</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* Panel lateral de filtros */}
          <div className="col-12 col-md-3 col-lg-2 mb-4">
            <div className={styles.sidebarPanel}>
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Categorías</label>
                <div className={styles.filterButtons}>
                  {roles.map(rol => (
                    <button 
                      key={rol}
                      className={`${styles.filterBtn} ${filtroActivo === rol ? styles.filterBtnActive : ""}`}
                      onClick={() => setFiltroActivo(rol)}
                    >
                      {rol === "Todos" ? "Todos" : rol + "s"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-12 col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              {/* Buscador y botón agregar */}
              <div className={styles.searchSection}>
                <div className="d-flex gap-2 flex-column flex-md-row">
                  <input
                    type="text"
                    placeholder="Buscar usuario"
                    className={`${styles.searchInput} flex-grow-1`}
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                  />
                  <button className={global.btnPrimary} onClick={() => abrirModal('agregar')}>
                    <span className={global.btnPrimaryMas}>+</span> Agregar Usuario
                  </button>
                </div>
              </div>

              {/* Lista de usuarios */}
              <div className={styles.loansListContainer}>
                <div className={styles.loansList}>
                  {usuariosFiltrados.map(usuario => (
                    <TarjetaUsuario 
                      key={usuario.id}
                      usuario={usuario}
                      onEditar={(usuario) => abrirModal('editar', usuario)}
                      onEliminar={(usuario) => abrirModal('eliminar', usuario)}
                    />
                  ))}
                  
                  {usuariosFiltrados.length === 0 && (
                    <div className={styles.noResults}>
                      <p>No se encontraron usuarios</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalEditarUsuario
        usuario={usuarioSeleccionado}
        isOpen={modalAbierto === 'editar'}
        onClose={cerrarModales}
        onGuardar={guardarUsuarioEditado}
      />

      <ModalAgregarUsuario
        isOpen={modalAbierto === 'agregar'}
        onClose={cerrarModales}
        onGuardar={agregarUsuario}
      />

      <ModalConfirmarEliminar
        usuario={usuarioSeleccionado}
        isOpen={modalAbierto === 'eliminar'}
        onClose={cerrarModales}
        onConfirm={eliminarUsuario}
      />
    </div>
  );
}