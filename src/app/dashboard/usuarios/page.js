"use client";

import { UsuarioService } from "@/services";
import React, { useState, useEffect, memo } from "react";
import styles from "@/styles/Usuarios.module.css";
import global from "@/styles/Global.module.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";

import Toast from "@/components/ui/Toast";
import AppHeader from "@/components/ui/AppHeader";
import PageTitle from "@/components/ui/PageTitle";
import FilterPanel from "@/components/ui/usuarios/FilterPanel";
import SearchSection from "@/components/ui/usuarios/SearchSection";

import UsuarioModal from "@/components/ui/usuarios/UsuarioModal"; 
import ModalConfirmarEliminar from "@/components/ui/usuarios/ModalConfirmarEliminar";

const rolColor = {
  "estudiante": { border: "#9370db" },
  "docente": { border: "#FF0004" },
  "consultor": { border: "#0F52BA" },
  "admin": { border: "#00C8FF" }
};

const rolLabel = {
  estudiante: "Estudiante",
  docente: "Docente",
  consultor: "Consultor",
  admin: "Administrador",
};

const roles = [
  { value: "Todos", label: "Todos" },
  { value: "estudiante", label: "Estudiantes" },
  { value: "docente", label: "Docentes" },
  { value: "consultor", label: "Consultores" },
  { value: "admin", label: "Administradores" }
];

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
        {rolLabel[usuario?.rol] || usuario?.rol}
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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroActivo, setFiltroActivo] = useState("Todos");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Función para obtener usuarios del backend 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UsuarioService.getUsers();
      const usuariosArray = response.data || [];

      const usuariosFormateados = usuariosArray.map(u => ({
        id: u._id,
        nombre: u.nombre || u.name,
        email: u.email,
        telefono: u.telefono || "N/A",
        rol: u.rol || "estudiante",
        fecha: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
      }));

      setUsuarios(usuariosFormateados);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      mostrarToast("Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
  const agregarUsuario = async (nuevoUsuario) => {
  try {
    const response = await UsuarioService.createUser(nuevoUsuario);
    const usuarioCreado = response.data; // <--- importante

    setUsuarios(prev => [...prev, {
      id: usuarioCreado._id,
      nombre: usuarioCreado.nombre,
      email: usuarioCreado.email,
      telefono: usuarioCreado.telefono || "N/A",
      rol: usuarioCreado.rol || "estudiante",
      fecha: usuarioCreado.createdAt ? new Date(usuarioCreado.createdAt).toLocaleDateString() : "N/A",
    }]);
    mostrarToast("Usuario agregado correctamente");
    cerrarModales();
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    mostrarToast("Error al agregar usuario", "error");
  }
};

  const guardarUsuarioEditado = async (datos) => {
    try {
      await UsuarioService.updateUser(usuarioSeleccionado.id, datos);

      //Refresca la lista después de editar
      await fetchUsers();

      mostrarToast("Usuario actualizado correctamente");
      cerrarModales();
    } catch (error) {
      mostrarToast("Error al actualizar usuario", "error");
      console.error(error);
    }
  };

  const eliminarUsuario = async () => {
    try {
      await UsuarioService.deleteUser(usuarioSeleccionado.id);

      setUsuarios(prev =>
        prev.filter(u => u.id !== usuarioSeleccionado.id)
      );

      mostrarToast("Usuario eliminado correctamente", "warning");
      cerrarModales();
    } catch (error) {
      mostrarToast("Error al eliminar usuario", "error");
      console.error(error);
    }
  };

  return (
    <div className={global.backgroundWrapper}>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={cerrarToast} />
      
      <AppHeader />
      
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
