"use client";
import React, { useState, useCallback } from "react";
import styles from "../../../styles/Usuarios.module.css";
import global from "../../../styles/Global.module.css";

const SearchSection = React.memo(({ 
  onSearchChange, 
  onNewItem, 
  placeholder = "Buscar usuario",
  buttonText = "Agregar Usuario",
  initialValue = ""
}) => {
  
  // Estado local del input de búsqueda
  const [localSearchValue, setLocalSearchValue] = useState(initialValue);
  
  // Manejar cambios locales y notificar al padre
  const handleSearchChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalSearchValue(newValue);
    
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  }, [onSearchChange]);

  return (
    <div className={styles.searchSection}>
      <div className="d-flex gap-2 flex-column flex-md-row">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder={placeholder}
          value={localSearchValue}
          onChange={handleSearchChange}
          className={`${styles.searchInput} flex-grow-1`}
        />

        {/* Botón de agregar usuario */}
        <button
          className={global.btnPrimary}
          onClick={onNewItem}
        >
          <span className={global.btnPrimaryMas}>+</span> {buttonText}
        </button>
      </div>
    </div>
  );
});

SearchSection.displayName = "SearchSection";

export default SearchSection;
