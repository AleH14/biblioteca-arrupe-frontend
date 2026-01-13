"use client";

import { UsuarioService } from "@/services";
import React, { useState, useEffect, memo } from "react";
import styles from "@/styles/Usuarios.module.css";
import global from "@/styles/Global.module.css";
import { FiEdit, FiUserX, FiUserCheck } from "react-icons/fi";

import Toast from "@/components/ui/Toast";
import AppHeader from "@/components/ui/AppHeader";
import PageTitle from "@/components/ui/PageTitle";
import FilterPanel from "@/components/ui/usuarios/FilterPanel";
import SearchSection from "@/components/ui/usuarios/SearchSection";

import UsuarioModal from "@/components/ui/usuarios/UsuarioModal";
import ModalConfirmarEstado from "@/components/ui/usuarios/ModalConfirmarEstado";

const rolColor = {
  estudiante: { border: "#9370db" },
  docente: { border: "#FF0004" },
  consultor: { border: "#0F52BA" },
  admin: { border: "#00C8FF" }
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

// Acciones del usuario (editar / deshabilitar / habilitar)
const AccionesUsuario = memo(
  ({ activo, usuario, onEditar, onDeshabilitar, onHabilitar }) => (
    <div className="d-flex gap-3 mt-3 justify-content-end">
      {activo && (
        <>
          <FiEdit
            className={styles.iconAction}
            title="Editar usuario"
            onClick={() => onEditar(usuario)}
          />
          <FiUserX
            className={styles.iconAction}
            title="Deshabilitar usuario"
            onClick={() => onDeshabilitar(usuario)}
          />
        </>
      )}
      {!activo && (
        <FiUserCheck
          className={styles.iconAction}
          title="Habilitar usuario"
          onClick={() => onHabilitar(usuario)}
        />
      )}
    </div>
  )
);

function TarjetaUsuario({ usuario, onEditar, onDeshabilitar, onHabilitar }) {
  const color = rolColor[usuario?.rol] || { border: "#ccc" };
  const activo = usuario?.activo !== false;

  return (
    <div
      className={styles.card}
      style={{
        borderTop: `5px solid ${color.border}`,
        position: "relative",
        opacity: activo ? 1 : 0.55,
        filter: activo ? "none" : "grayscale(40%)",
      }}
    >
      <div
        className={styles.rolBadge}
        style={{ backgroundColor: color.border }}
      >
        {rolLabel[usuario?.rol] || usuario?.rol}
      </div>

      {!activo && (
        <div className={styles.badgeDeshabilitado}>
          DESHABILITADO
        </div>
      )}

      <div className={styles.loanInfo}>
        <strong>{usuario?.nombre}</strong><br />
        <small>{usuario?.email}</small><br />
        <small>{usuario?.telefono}</small><br />
        <small className={styles.fecha}>
          Registrado: {usuario?.fecha}
        </small>
      </div>

      <AccionesUsuario
        activo={activo}
        usuario={usuario}
        onEditar={onEditar}
        onDeshabilitar={onDeshabilitar}
        onHabilitar={onHabilitar}
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
        activo: u.activo !== false,
        fecha: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString()
          : "N/A",
      }));

      setUsuarios(usuariosFormateados);
    } catch {
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
  
  const coincideFiltro =
    filtroActivo === "Todos" ||
    (filtroActivo === "deshabilitados"
      ? usuario.activo === false
      : usuario.rol === filtroActivo);

  const coincideBusqueda =
    !terminoBusqueda.trim() ||
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

  const agregarUsuario = async (nuevoUsuario) => {
    try {
      await UsuarioService.createUser(nuevoUsuario);
      await fetchUsers();
      mostrarToast("Usuario agregado correctamente");
      cerrarModales();
    } catch {
      mostrarToast("Error al agregar usuario", "error");
    }
  };

  const guardarUsuarioEditado = async (datos) => {
    try {
      await UsuarioService.updateUser(usuarioSeleccionado.id, datos);
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u =>
          u.id === usuarioSeleccionado.id
            ? { ...u, ...datos }
            : u
        )
      );
      mostrarToast("Usuario actualizado correctamente");
      cerrarModales();
    } catch {
      mostrarToast("Error al actualizar usuario", "error");
    }
  };

  const deshabilitarUsuario = async () => {
    try {
      await UsuarioService.disableUser(usuarioSeleccionado.id);
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u =>
          u.id === usuarioSeleccionado.id
            ? { ...u, activo: false }
            : u
        )
      );
      mostrarToast("Usuario deshabilitado correctamente", "warning");
      cerrarModales();
    } catch {
      mostrarToast("Error al deshabilitar usuario", "error");
    }
  };

  const habilitarUsuario = async (usuario) => {
    try {
      await UsuarioService.enableUser(usuario.id);
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(u =>
          u.id === usuario.id
            ? { ...u, activo: true }
            : u
        )
      );
      mostrarToast("Usuario habilitado correctamente");
      cerrarModales();
    } catch {
      mostrarToast("Error al habilitar usuario", "error");
    }
  };

  return (
    <div className={global.backgroundWrapper}>
      <Toast {...toast} onClose={cerrarToast} />

      <AppHeader />
      <PageTitle title="USUARIOS" imgSrc="/images/complemento-1.png" />

      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-3 col-lg-2 mb-4">
            <FilterPanel
              roles={roles}
              filtroActivo={filtroActivo}
              setFiltroActivo={setFiltroActivo}
            />
          </div>

          <div className="col-12 col-md-9 col-lg-8">
            <SearchSection
              placeholder="Buscar usuario"
              buttonText="Agregar Usuario"
              onSearchChange={setTerminoBusqueda}
              onNewItem={() => abrirModal("agregar")}
            />

            <div className={styles.loansList}>
              {usuariosFiltrados.map(usuario => (
                <TarjetaUsuario
                  key={usuario.id}
                  usuario={usuario}
                  onEditar={(u) => abrirModal("editar", u)}
                  onDeshabilitar={(u) => abrirModal("deshabilitar", u)}
                  onHabilitar={(u) => abrirModal("habilitar", u)}
                />
              ))}
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

      {/* Modal de confirmación reutilizable para deshabilitar/habilitar */}
      <ModalConfirmarEstado
        usuario={usuarioSeleccionado}
        isOpen={modalAbierto === "deshabilitar" || modalAbierto === "habilitar"}
        onClose={cerrarModales}
        onConfirm={() => {
          if (modalAbierto === "deshabilitar") deshabilitarUsuario();
          else habilitarUsuario(usuarioSeleccionado);
        }}
        actionLabel={modalAbierto === "deshabilitar" ? "Deshabilitar" : "Habilitar"}
        mensaje={
          modalAbierto === "deshabilitar"
            ? "¿Desea deshabilitar a " 
            : "¿Desea habilitar a "
        }
      />

    </div>
  );
}
