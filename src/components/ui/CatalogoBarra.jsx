import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import global from '../../styles/Global.module.css';
import styles from '../../styles/catalogo.module.css';

const CatalogoBarra = React.memo(({ 
  searchValue,
  onSearchChange,
  onToggleFilters,
  showFilters,
  activeFiltersCount,
  onAddBook 
}) => {
  const handleSearchChange = React.useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleToggleFilters = React.useCallback(() => {
    onToggleFilters();
  }, [onToggleFilters]);

  const handleAddBook = React.useCallback(() => {
    onAddBook();
  }, [onAddBook]);

  return (
    <div className={styles.searchActionsContainer}>
      <div className={styles.searchWrapper}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar por título, autor o editorial..."
          className={styles.searchInput}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.actionsWrapper}>
        <button 
          className={`${styles.filterButton} ${showFilters ? styles.filterButtonActive : ''}`}
          onClick={handleToggleFilters}
        >
          <FiFilter />
          Filtros
          {activeFiltersCount > 0 && (
            <span className={styles.filterCounter}>{activeFiltersCount}</span>
          )}
        </button>
        
        <button className={global.btnPrimary} onClick={handleAddBook}>
          <span className={global.btnPrimaryMas}>+</span> Agregar Libro
        </button>
      </div>
    </div>
  );
});

CatalogoBarra.displayName = 'CatalogoBarra';
export default CatalogoBarra;