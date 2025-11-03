"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import styles from "../../styles/MenuForm.module.css";
import global from "../../styles/Global.module.css";
import { MdLogout } from "react-icons/md";
import ButtonIcon from "../ui/ButtonIcon";
import NoteIcon from "../svg/note.jsx";
import CatalogoIcon from "../svg/catalogo.jsx";
import ChartIcon from "../svg/Chart.jsx";
import UserIcon from "../svg/User.jsx";
import Ayuda from "../svg/Ayuda.jsx";

// Componente memoizado para el header
const Header = React.memo(({ onLogout }) => (
  <header
    className={`${global.header} d-flex justify-content-between align-items-center`}
  >
    {/* Logo del colegio optimizado con Next.js Image */}
    <button className={global.homeBtn} aria-label="Ir al inicio">
      <Image
        src="/images/logo_1000px.png"
        alt="Logo Colegio"
        width={0}
        height={0}
        priority={false}
        className={styles.logoHeader}
        sizes="60px"
      />
    </button>
    {/* Cerrar sesión responsivo - solo ícono en móvil */}
    <button className={global.logoutBtn} onClick={onLogout} aria-label="Cerrar sesión">
      <MdLogout className={global.logoutIcon} aria-hidden="true" />
      <span className="d-none d-sm-inline">Cerrar sesión</span>
    </button>
  </header>
));

Header.displayName = 'Header';

// Componente memoizado para el título
const PageTitle = React.memo(() => (
  <div className="container my-4">
    <div className="row justify-content-center">
      <div className="col-auto">
        <div className="d-flex align-items-center justify-content-center">
          <Image
            src="/images/complemento-1.png"
            alt="Complemento decorativo"
            width={40}
            height={40}
            priority={false}
            className={global.complementoImg + " me-3"}
            sizes="40px"
          />
          <h1 className={`${global.title} mb-0 ${styles.redTitle}`}>
            Panel de Administración
          </h1>
        </div>
      </div>
    </div>
  </div>
));

PageTitle.displayName = 'PageTitle';

// Componente memoizado para cada item del menú
const MenuItem = React.memo(({ onClick, title, IconComponent, className = "" }) => (
  <div
    className={`col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center ${className}`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    aria-label={`Ir a ${typeof title === 'string' ? title : 'Préstamos/Devolución'}`}
  >
    <ButtonIcon titulo={title} IconComponent={IconComponent} />
  </div>
));

MenuItem.displayName = 'MenuItem';

// Componente memoizado para el botón de ayuda
const HelpButton = React.memo(() => (
  <div className={styles.helpButton}>
    <button
      className={`${styles.helpBtn} d-flex flex-column align-items-center p-2 rounded-circle`}
      aria-label="Obtener ayuda"
    >
      <Ayuda className={styles.helpIcon} aria-hidden="true" />
      <small className={styles.helpText}>Ayuda</small>
    </button>
  </div>
));

HelpButton.displayName = 'HelpButton';

export default function MenuForm({ irPrestamos, irCatalogo, irLogin, irEstadisticas, irUsuarios }) {
  // Memoizar las funciones callback para evitar recrearlas en cada render
  const handleLogout = useCallback(() => {
    if (irLogin) irLogin();
  }, [irLogin]);

  const handlePrestamos = useCallback(() => {
    if (irPrestamos) irPrestamos();
  }, [irPrestamos]);

  const handleCatalogo = useCallback(() => {
    if (irCatalogo) irCatalogo();
  }, [irCatalogo]);

  const handleEstadisticas = useCallback(() => {
    if (irEstadisticas) irEstadisticas();
  }, [irEstadisticas]);

  const handleUsuarios = useCallback(() => {
    if (irUsuarios) irUsuarios();
  }, [irUsuarios]);

  // Título con salto de línea memoizado
  const prestamosTitle = React.useMemo(() => (
    <>
      Préstamos/
      <br />
      Devolución
    </>
  ), []);

  return (
    <div className={styles.backgroundWrapper}>
      {/* Contenedor principal con padding */}
      <div className={styles.mainContainer}>
        {/* Header memoizado */}
        <Header onLogout={handleLogout} />

        {/* Título memoizado */}
        <PageTitle />

        {/* Grid de botones */}
        <div className="container py-3">
          <div className="row g-4 justify-content-center">
            <MenuItem
              onClick={handlePrestamos}
              title={prestamosTitle}
              IconComponent={NoteIcon}
            />
            
            <MenuItem
              onClick={handleCatalogo}
              title="Catálogo"
              IconComponent={CatalogoIcon}
            />
            
            <MenuItem
              onClick={handleEstadisticas}
              title="Estadísticas"
              IconComponent={ChartIcon}
            />
            
            <MenuItem
              onClick={handleUsuarios}
              title="Usuarios"
              IconComponent={UserIcon}
            />
          </div>
        </div>

        {/* Botón de ayuda memoizado */}
        <HelpButton />
      </div>
    </div>
  );
}
