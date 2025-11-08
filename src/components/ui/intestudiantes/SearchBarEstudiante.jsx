"use client";
import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import styles from '../../../styles/IntEstudiantes.module.css';

const SearchBarEstudiante = React.memo(({ 
  searchValue,
  onSearchChange,
  onToggleFilters,
  showFilters,
  activeFiltersCount
}) => {

  const handleSearchChange = React.useCallback(
    (e) => onSearchChange(e.target.value),
    [onSearchChange]
  );

  const handleToggleFilters = React.useCallback(
    () => onToggleFilters(),
    [onToggleFilters]
  );

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
      </div>
    </div>
  );
});

SearchBarEstudiante.displayName = 'SearchBarEstudiante';
export default SearchBarEstudiante;
