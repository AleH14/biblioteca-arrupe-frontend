import React, { useState, useCallback } from 'react';
import styles from '../../../styles/PrestamoVista.module.css';
import global from '../../../styles/Global.module.css';

const SearchSection = React.memo(({ 
  onSearchChange, 
  onNewItem, 
  placeholder = "Buscar préstamo",
  buttonText = "Nuevo Préstamo",
  initialValue = ""
}) => {
  
  // Estado local del input de búsqueda - no afecta al componente padre
  const [localSearchValue, setLocalSearchValue] = useState(initialValue);
  
  // Manejar cambios locales y notificar al padre de forma optimizada
  const handleSearchChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalSearchValue(newValue);
    
    // Notificar al padre solo el valor, de forma debounced para mejor performance
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  }, [onSearchChange]);

  return (
    <div className={styles.searchSection}>
      <div className="d-flex gap-2 flex-column flex-md-row">
        <input
          type="text"
          placeholder={placeholder}
          value={localSearchValue}
          onChange={handleSearchChange}
          className={`${styles.searchInput} flex-grow-1`}
        />
        <button className={global.btnPrimary} onClick={onNewItem}>
          <span className={global.btnPrimaryMas}>+</span> {buttonText}
        </button>
      </div>
    </div>
  );
});

SearchSection.displayName = 'SearchSection';

export default SearchSection;