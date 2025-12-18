"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '@/contexts/AuthContext';
import global from '../../../styles/Global.module.css';
import style from '../../../styles/IntEstudiantes.module.css';

const AppHeaderEstudiante = React.memo(() => {
  const router = useRouter();
  const { logout, user } = useAuth();

  // Obtener nombre del usuario desde el contexto
  const userName = user?.nombre || 
                   user?.name || 
                   user?.email?.split("@")[0] || 
                   "Estudiante";

  const handleHomeClick = () => {
    router.push('/dashboard');
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  return (
    <header className={`${global.header} d-flex justify-content-between align-items-center`}>
      {/* Saludo con nombre del usuario */}
      <div className={style.username}>
        <span>¡Hola {userName}!</span>
      </div>
       
      {/* Botón de cerrar sesión */}
      <div className={`${global.headerActions} d-flex align-items-center`}>
        <button 
          className={global.logoutBtn} 
          onClick={handleLogoutClick}
        >
          <MdLogout className={global.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
});

AppHeaderEstudiante.displayName = "AppHeaderEstudiante";

export default AppHeaderEstudiante;