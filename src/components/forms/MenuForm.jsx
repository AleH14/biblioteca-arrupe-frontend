"use client";
import React from "react";
import styles from "../../styles/MenuForm.module.css";
import global from "../../styles/Global.module.css";
import { MdLogout } from "react-icons/md";
import ButtonIcon from "../ui/ButtonIcon";
import NoteIcon from "../svg/note.jsx";
import CatalogoIcon from "../svg/catalogo.jsx";
import ChartIcon from "../svg/Chart.jsx";
import UserIcon from "../svg/User.jsx";
import Ayuda from "../svg/Ayuda.jsx";

export default function MenuForm({ irPrestamos, irCatalogo, irLogin, irEstadisticas }) {
  return (
    <div className={styles.backgroundWrapper}>
      {/* Contenedor principal con padding */}
      <div className={styles.mainContainer}>
        {/* Header */}
        <header
          className={`${global.header} d-flex justify-content-between align-items-center`}
        >
          {/* Logo del colegio MÁS GRANDE */}
          <button className={global.homeBtn}>
            <img
              src="/images/logo_1000px.png"
              alt="Logo Colegio"
              className={styles.logoHeader}
            />
          </button>
          {/* Cerrar sesión responsivo - solo ícono en móvil */}
          <button className={global.logoutBtn}>
            <MdLogout className={global.logoutIcon} />
            <span className="d-none d-sm-inline">Cerrar sesión</span>
          </button>
        </header>

        {/* Título más cerca de las cards */}
        <div className="container my-4">
          <div className="row justify-content-center">
            <div className="col-auto">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src="/images/complemento-1.png"
                  alt="Complemento"
                  className={global.complementoImg + " me-3"}
                />
                <h1 className={`${global.title} mb-0 ${styles.redTitle}`}>
                  Panel de Administración
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de botones más cerca del título */}
        <div className="container py-3">
          <div className="row g-4 justify-content-center">
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center"
              onClick={irPrestamos}
            >
              <ButtonIcon
                titulo={
                  <>
                    Préstamos/
                    <br />
                    Devolución
                  </>
                }
                IconComponent={NoteIcon}
              />
            </div>
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center"
              onClick={irCatalogo}
            >
              <ButtonIcon titulo="Catálogo" IconComponent={CatalogoIcon} />
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center"
             onClick={irEstadisticas}>
              <ButtonIcon titulo="Estadísticas" IconComponent={ChartIcon} />
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
              <ButtonIcon titulo="Usuarios" IconComponent={UserIcon} />
            </div>
          </div>
        </div>

        {/* Botón Ayuda sin borde, solo hover */}
        <div className={styles.helpButton}>
          <button
            className={`${styles.helpBtn} d-flex flex-column align-items-center p-2 rounded-circle`}
          >
            <Ayuda className={styles.helpIcon} />
            <small className={styles.helpText}>Ayuda</small>
          </button>
        </div>
      </div>
    </div>
  );
}
