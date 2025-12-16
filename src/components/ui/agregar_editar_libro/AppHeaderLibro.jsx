"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from "../../../styles/Global.module.css";
import librosStyles from "../../../styles/librosForm.module.css";
import { FiArrowLeft } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

const AppHeaderLibro = React.memo(({ children }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleVolver = React.useCallback(() => {
    router.push('/dashboard/catalogo');
  }, [router]);

  const handleCerrarSesion = React.useCallback(async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, [logout, router]);

  return (
    <>
      {/* Header */}
      <header className={`${styles.header} d-flex justify-content-between align-items-center`}>
        <button className={librosStyles.volverBtn} onClick={handleVolver}>
          <FiArrowLeft className={librosStyles.volverIcon} />
          <span className={librosStyles.volverTexto}>Volver a Catálogo</span>
        </button>
        <button className={styles.logoutBtn} onClick={handleCerrarSesion}>
          <MdLogout className={styles.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </header>

      {children}
    </>
  );
});

AppHeaderLibro.displayName = 'AppHeaderLibro';

export default AppHeaderLibro;