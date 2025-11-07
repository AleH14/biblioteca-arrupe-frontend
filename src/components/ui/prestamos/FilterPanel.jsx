import React from 'react';
import styles from '../../../styles/PrestamoVista.module.css';
import global from '../../../styles/Global.module.css';

const FilterPanel = React.memo(({ 
  filtro, 
  onFiltroChange, 
  filters = ["Todos", "Activos", "Atrasados", "Devueltos", "Reservados"], // Actualizado
  onGenerateReport 
}) => {
  return (
    <div className={styles.sidebarPanel}>
      <button 
        className={`${global.btnSecondary} w-100 mb-3`}
        onClick={onGenerateReport}
      >
        Generar Informe
      </button>

      <div className={styles.filterSection}>
        <small className={styles.filterLabel}>Clasificación</small>
        <div className={styles.filterButtons}>
          {filters.map((tipo) => (
            <button
              key={tipo}
              className={`${styles.filterBtn} ${
                filtro === tipo
                  ? styles.filterBtnActive
                  : styles.filterBtnInactive
              }`}
              onClick={() => onFiltroChange(tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;