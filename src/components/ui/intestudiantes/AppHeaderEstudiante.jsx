import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MdLogout } from "react-icons/md";
import global from "../../../styles/Global.module.css";
import style from "../../../styles/IntEstudiantes.module.css";

const AppHeaderEstudiante = React.memo(
  ({
    onHomeClick,
    onLogoutClick,
    userName = "Estudiante",
    showLogout = true,
  }) => {
    const { logout } = useAuth();

    const handleCerrarSesion = React.useCallback(async () => {
      try {
        if (onLogoutClick) {
          await onLogoutClick();
        } else {
          await logout();
        }
      } catch (error) {
        // agregar manejo de errores
      }
    }, [logout, onLogoutClick]);

    return (
        <header className={`${global.header} d-flex justify-content-between align-items-center`}>
        {/* Saludo con nombre del usuario */}
        <button className={style.username}>
           <span>¡Hola {userName}!</span>
        </button>
         
        <div className={`${global.headerActions} d-flex align-items-center`}>
          {showLogout && (
            <button className={global.logoutBtn} onClick={handleCerrarSesion}>
              <MdLogout className={global.logoutIcon} />
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>
      </header>
    );
  }
);

AppHeaderEstudiante.displayName = "AppHeaderEstudiante";

export default AppHeaderEstudiante;