import React from 'react';
import { FiHome } from 'react-icons/fi';
import { MdLogout } from 'react-icons/md';
import global from '../../styles/Global.module.css';

const AppHeader = React.memo(({ onHomeClick, onLogoutClick, showLogout = true }) => {
  console.count('🏠 AppHeader render'); // Para verificar renders
  return (
    <header className={`${global.header} d-flex justify-content-between align-items-center`}>
      <button className={global.homeBtn} onClick={onHomeClick}>
        <FiHome className={global.homeIcon} />
      </button>
      {showLogout && (
        <button className={global.logoutBtn} onClick={onLogoutClick}>
          <MdLogout className={global.logoutIcon} />
          <span>Cerrar sesión</span>
        </button>
      )}
    </header>
  );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;