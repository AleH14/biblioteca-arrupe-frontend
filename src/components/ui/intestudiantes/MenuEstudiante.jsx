import React from 'react';
import { FiBook, FiClock } from 'react-icons/fi';
import styles from '../../../styles/IntEstudiantes.module.css';

const MenuEstudiante = React.memo(({ activeView, onViewChange }) => {
  return (
    <div className={styles.mainNav}>
      <div className="container">
        <div className={styles.navTabs}>
          <button
            className={`${styles.navTab} ${activeView === "catalogo" ? styles.navTabActive : ""}`}
            onClick={() => onViewChange("catalogo")}
          >
            <FiBook className={styles.navIcon} />
            <span>Catálogo</span>
          </button>
          <button
            className={`${styles.navTab} ${activeView === "historial" ? styles.navTabActive : ""}`}
            onClick={() => onViewChange("historial")}
          >
            <FiClock className={styles.navIcon} />
            <span>Mi Actividad</span>
          </button>
        </div>
      </div>
    </div>
  );
});

MenuEstudiante.displayName = 'MenuEstudiante';

export default MenuEstudiante;