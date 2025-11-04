"use client";
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from "../../../styles/Global.module.css";
import librosStyles from "../../../styles/librosForm.module.css";
import { FiArrowLeft } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

const AppHeaderLibro = React.memo(({ 
  onVolver, 
  onCerrarSesion,
  children 
}) => {
  const { logout } = useAuth();

  const handleCerrarSesion = React.useCallback(async () => {
    try {
      if (onCerrarSesion) {
        await onCerrarSesion();
      } else {
        // Lógica por defecto usando useAuth
        await logout();
      }
    } catch (error) { // Manejo de errores futuro con API
    }
  }, [logout, onCerrarSesion]);

  return (
    <>
      {/* Header */}
      <header className={`${styles.header} d-flex justify-content-between align-items-center`}>
        <button className={librosStyles.volverBtn} onClick={onVolver}>
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