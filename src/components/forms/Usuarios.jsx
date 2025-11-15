"use client";
import React, { useState, memo } from "react";
import styles from "../../styles/Usuarios.module.css";
import global from "../../styles/Global.module.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import Toast from "../ui/Toast";
import AppHeader from "../ui/AppHeader";
import PageTitle from "../ui/PageTitle";
import FilterPanel from "../ui/usuarios/FilterPanel";
import SearchSection from "../ui/usuarios/SearchSection";

import UsuarioModal from "../ui/usuarios/UsuarioModal"; 
import ModalConfirmarEliminar from "../ui/usuarios/ModalConfirmarEliminar";

import { useAuth } from "@/contexts/AuthContext"; 

const rolColor = {
  "Bibliotecario": { border: "#FF0004" },
  "Administrativo": { border: "#00C8FF" },
  "Colaborador": { border: "#0F52BA" },
  "Estudiante": { border: "#9370db" }
};

const usuariosData = [
  { id: 1, nombre: "René Abarca", rol: "Bibliotecario", email: "rene@fundacionpadrearrupe.org", telefono: "7788-6625", fecha: "12/10/2024", password: "Ra123456#" },
  { id: 2, nombre: "Luis Rivas", rol: "Administrativo", email: "lrivas@fundacionpadrearrupe.org", telefono: "7688-6625", fecha: "12/10/2024", password: "Admin2024#" },
  { id: 3, nombre: "Carla Méndez", rol: "Colaborador", email: "carla@fundacionpadrearrupe.org", telefono: "7777-1234", fecha: "15/10/2024", password: "Carla123#" },
  { id: 4, nombre: "Jorge López", rol: "Estudiante", email: "jorge@fundacionpadrearrupe.org", telefono: "7666-4321", fecha: "20/10/2024", password: "Jorgepass12#" },
];

const roles = ["Todos", "Bibliotecario", "Administrativo", "Colaborador", "Estudiante"];

// Memoizamos los iconos
const AccionesUsuario = memo(({ onEditar, onEliminar }) => (
  <div className="d-flex gap-3 mt-3 justify-content-end">
    <FiEdit className={styles.iconAction} title="Editar usuario" onClick={onEditar} />
    <FiTrash2 className={styles.iconAction} title="Eliminar usuario" onClick={onEliminar} />
  </div>
));

function TarjetaUsuario({ usuario, onEditar, onEliminar }) {
  const color = rolColor[usuario?.rol] || { border: "#ccc" };
  return (
    <div className={styles.card} style={{ borderTop: `5px solid ${color.border}`, position: 'relative' }}>
      <div className={styles.rolBadge} style={{ backgroundColor: color.border }}>
        {usuario?.rol}
      </div>
      <div className={styles.loanInfo}>
        <strong>{usuario?.nombre}</strong><br/>
        <small>{usuario?.email}</small><br/>
        <small>{usuario?.telefono}</small><br/>
        <small className={styles.fecha}>Registrado: {usuario?.fecha}</small>
      </div>
      <AccionesUsuario 
        onEditar={() => onEditar(usuario)} 
        onEliminar={() => onEliminar(usuario)} 
      />
    </div>
  );
}

export default function Usuarios({ volverMenu }) {
  const { logout } = useAuth();
  const [usuarios, setUsuarios] = useState(usuariosData);
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const mostrarToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };
  const cerrarToast = () => setToast(prev => ({ ...prev, show: false }));

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideFiltro = filtroActivo === "Todos" || usuario.rol === filtroActivo;
    const coincideBusqueda = !terminoBusqueda.trim() ||
      usuario.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.telefono.includes(terminoBusqueda);
    return coincideFiltro && coincideBusqueda;
  });

  const abrirModal = (tipo, usuario = null) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(tipo);
  };
  const cerrarModales = () => {
    setModalAbierto(null);
    setUsuarioSeleccionado(null);
  };

  // CRUD
  const agregarUsuario = (nuevoUsuario) => {
    const nuevoId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    setUsuarios(prev => [...prev, { ...nuevoUsuario, id: nuevoId }]);
    mostrarToast("Usuario agregado correctamente");
    cerrarModales();
  };

  const guardarUsuarioEditado = (datos) => {
    setUsuarios(prev => prev.map(u => u.id === usuarioSeleccionado.id ? { ...u, ...datos } : u));
    mostrarToast("Usuario actualizado correctamente");
    cerrarModales();
  };

  const eliminarUsuario = () => {
    setUsuarios(prev => prev.filter(u => u.id !== usuarioSeleccionado.id));
    mostrarToast("Usuario eliminado correctamente", "warning");
    cerrarModales();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      mostrarToast("No se pudo cerrar sesión", "warning");
    }
  };

  return (
    <div className={global.backgroundWrapper}>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={cerrarToast} />
      <AppHeader onHomeClick={volverMenu} onLogoutClick={handleLogout} />
      <PageTitle title="USUARIOS" imgSrc="/images/complemento-1.png" />

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-3 col-lg-2 mb-4">
            <FilterPanel roles={roles} filtroActivo={filtroActivo} setFiltroActivo={setFiltroActivo} />
          </div>
          <div className="col-12 col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              <SearchSection 
                placeholder="Buscar usuario"
                buttonText="Agregar Usuario"
                initialValue=""
                onSearchChange={setTerminoBusqueda}
                onNewItem={() => abrirModal("agregar")}
              />
              <div className={styles.loansListContainer}>
                <div className={styles.loansList}>
                  {usuariosFiltrados.map(usuario => (
                    <TarjetaUsuario 
                      key={usuario.id} 
                      usuario={usuario} 
                      onEditar={(u) => abrirModal("editar", u)}
                      onEliminar={(u) => abrirModal("eliminar", u)}
                    />
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

      <UsuarioModal 
        isOpen={modalAbierto === "agregar" || modalAbierto === "editar"}
        onClose={cerrarModales}
        onGuardar={modalAbierto === "editar" ? guardarUsuarioEditado : agregarUsuario}
        usuario={usuarioSeleccionado}
        title={modalAbierto === "editar" ? "Editar Usuario" : "Agregar Usuario"}
        submitText={modalAbierto === "editar" ? "Guardar Cambios" : "Agregar Usuario"}
      />

      <ModalConfirmarEliminar 
        usuario={usuarioSeleccionado} 
        isOpen={modalAbierto === "eliminar"} 
        onClose={cerrarModales} 
        onConfirm={eliminarUsuario} 
      />
    </div>
  );
}
