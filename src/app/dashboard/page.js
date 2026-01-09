'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MdLogout } from 'react-icons/md';

import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ButtonIcon from '@/components/ui/ButtonIcon';
import {
  Ayuda,
  CatalogoIcon,
  ChartIcon,
  NoteIcon,
  UserIcon
} from '@/components/svg';

import styles from '../../styles/MenuForm.module.css';
import global from '../../styles/Global.module.css';

// Componente memoizado para el header
const Header = React.memo(({ onLogout }) => (
  <header
    className={`${global.header} d-flex justify-content-between align-items-center`}
  >
    {/* Logo del colegio*/}
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
    {/* Cerrar sesión responsivo */}
    <button className={global.logoutBtn} onClick={onLogout} aria-label="Cerrar sesión">
      <MdLogout className={global.logoutIcon} aria-hidden="true" />
      <span className="d-none d-sm-inline">Cerrar sesión</span>
    </button>
  </header>
));

Header.displayName = 'Header';

// Componente memoizado para el título - EXACTO AL ORIGINAL
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
const MenuItem = React.memo(({ href, title, IconComponent, className = "" }) => {
  return (
    <div className={`col-auto d-flex justify-content-center ${className}`}>
      <Link
        href={href}
        className="text-decoration-none d-flex justify-content-center"
        aria-label={`Ir a ${typeof title === 'string' ? title : 'Préstamos/Devolución'}`}
        style={{ cursor: 'pointer' }}
      >
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.closest('a').click();
            }
          }}
        >
          <ButtonIcon titulo={title} IconComponent={IconComponent} />
        </div>
      </Link>
    </div>
  );
});

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

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      router.push('/login');
    }
  };

  // Título con salto de línea memoizado 
  const prestamosTitle = React.useMemo(() => (
    <>
      Préstamos/
      <br />
      Devolución
    </>
  ), []);

  if (loading || !user) {
    return (
      <div className={styles.backgroundWrapper}>
        <div className={`${styles.mainContainer} d-flex justify-content-center align-items-center`}>
          <LoadingSpinner message="Cargando..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backgroundWrapper}>
      {/* Contenedor principal con padding */}
      <div className={styles.mainContainer}>
        {/* Header memoizado */}
        <Header onLogout={handleLogout} />

        {/* Título memoizado */}
        <PageTitle />

        {/* Grid de botones*/}
        <div className="container py-3">
          <div className="row g-4 justify-content-center">
            <MenuItem
              href="/dashboard/prestamos"
              title={prestamosTitle}
              IconComponent={NoteIcon}
            />
            
            <MenuItem
              href="/dashboard/catalogo"
              title="Catálogo"
              IconComponent={CatalogoIcon}
            />
            
            <MenuItem
              href="/dashboard/estadisticas"
              title="Estadísticas"
              IconComponent={ChartIcon}
            />
            
            <MenuItem
              href="/dashboard/usuarios"
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