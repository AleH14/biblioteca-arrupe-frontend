"use client";
import React from "react";
import styles from "../../styles/Usuarios.module.css";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const rolColor = {
  "Bibliotecario": { border: "#ff4d4d" }, // Rojo Vivo
  "Administrativo": { border: "#00ffff" }, // Cian
  "Colaborador": { border: "#0F52BA" }, // Azul
  "Estudiante": { border: "#9370db" } // Morado
};


const TarjetaUsuario = ({ nombre, rol, email, telefono, fecha }) => {
  const color = rolColor[rol];
  return (
    <div className={styles.card} style={{ borderTop: `5px solid ${color.border}`, backgroundColor: color.background, position: "relative" }}>
      
      <div className={styles.rolBadge} style={{ backgroundColor: color.border }}>
        {rol}
      </div>
 
      <div className={styles.loanInfo}>
        <strong>{nombre}</strong>
        <br />
        <small>{email}</small>
        <br />
        <small>{telefono}</small>
        <br />
        <small className={styles.fecha}>Registrado: {fecha}</small>
      </div>

      <div className="d-flex gap-3 mt-3 justify-content-end">
        <FiEdit className={styles.iconAction} title="Editar usuario" />
        <FiTrash2 className={styles.iconAction} title="Eliminar usuario" />
      </div>
    </div>
  );
};

const Usuarios = ({ volverMenu }) => {
  return (
    <div className={global.backgroundWrapper}>
      {/* HEADER */}
      <header className={`${global.header} d-flex justify-content-between align-items-center`}>
        <button className={global.homeBtn} onClick={volverMenu}>
          <FiHome className={global.homeIcon} />
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* TÍTULO */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={global.complementoImg + " me-2"}
              />
              <h1 className={`${global.title} mb-0`}>USUARIOS</h1>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* PANEL LATERAL */}
          <div className="col-12 col-md-3 col-lg-2 mb-4">
            <div className={styles.sidebarPanel}>
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Categorías</label>
                <div className={styles.filterButtons}>
                  <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>Todos</button>
                  <button className={styles.filterBtn}>Bibliotecarios</button>
                  <button className={styles.filterBtn}>Administrativos</button>
                  <button className={styles.filterBtn}>Colaboradores</button>
                  <button className={styles.filterBtn}>Estudiantes</button>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="col-12 col-md-9 col-lg-8">
            <div className={styles.mainContent}>
              {/* BUSCADOR */}
              <div className={styles.searchSection}>
                <div className="d-flex gap-2 flex-column flex-md-row">
                  <input
                    type="text"
                    placeholder="Buscar usuario"
                    className={`${styles.searchInput} flex-grow-1`}
                  />
                  <button className={global.btnPrimary}>
                    <span className={global.btnPrimaryMas}>+</span> Agregar Usuario
                  </button>
                </div>
              </div>

              {/* LISTADO DE USUARIOS */}
              <div className={styles.loansListContainer}>
                <div className={styles.loansList}>
                  <TarjetaUsuario 
                    nombre="René Abarca" 
                    rol="Bibliotecario" 
                    email="rene@fundacionpadrearrupe.org" 
                    telefono="7788-6625" 
                    fecha="12/10/2024" 
                  />
                  <TarjetaUsuario 
                    nombre="Luis Rivas" 
                    rol="Administrativo" 
                    email="lrivas@fundacionpadrearrupe.org" 
                    telefono="7688-6625" 
                    fecha="12/10/2024" 
                  />
                   <TarjetaUsuario 
                     nombre="Carla Méndez" 
                     rol="Colaborador" 
                     email="carla@fundacionpadrearrupe.org" 
                     telefono="7777-1234" 
                     fecha="15/10/2024" 
                    />
                    <TarjetaUsuario 
                     nombre="Jorge López" 
                     rol="Estudiante" 
                     email="jorge@fundacionpadrearrupe.org" 
                     telefono="7666-4321" 
                     fecha="20/10/2024" 
                    />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
