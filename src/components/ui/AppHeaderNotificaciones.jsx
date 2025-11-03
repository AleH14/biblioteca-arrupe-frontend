import React from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import global from '../../styles/Global.module.css';
import styles from '../../styles/NotificacionesCorreo.module.css';

const AppHeaderNotificaciones = React.memo(({ onVolverClick, onLogoutClick }) => {
  return (
    <header className={`${global.header} d-flex justify-content-between align-items-center`}>
      <button className={styles.volverBtn} onClick={onVolverClick}>
        <FiArrowLeft className={styles.volverIcon} />
        <span className={`${styles.volverTexto} d-none d-md-inline`}>Volver a Préstamos</span>
      </button>
      
      {/*  Botón de logout */}
      <button className={global.logoutBtn} onClick={onLogoutClick}>
        <MdLogout className={global.logoutIcon} />
        <span className="d-none d-sm-inline">Cerrar sesión</span>
      </button>
    </header>
  );
});

AppHeaderNotificaciones.displayName = 'AppHeaderNotificaciones';

export default AppHeaderNotificaciones;