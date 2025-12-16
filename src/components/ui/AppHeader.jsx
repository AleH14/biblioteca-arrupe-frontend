"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FiHome } from 'react-icons/fi';
import { MdLogout } from 'react-icons/md';
import { useAuth } from '@/contexts/AuthContext';
import global from '../../styles/Global.module.css';

const AppHeader = React.memo(({ showLogout = true }) => {
  const router = useRouter();
  const { logout } = useAuth();

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
      <button 
        className={global.homeBtn} 
        onClick={handleHomeClick}
      >
        <FiHome className={global.homeIcon} />
      </button>
      {showLogout && (
        <button 
          className={global.logoutBtn} 
          onClick={handleLogoutClick}
          aria-label="Cerrar sesión"
        >
          <MdLogout className={global.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      )}
    </header>
  );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;