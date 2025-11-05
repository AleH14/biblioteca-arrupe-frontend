import React from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from '../../../styles/catalogo.module.css';

const CatalogoEmptyState = React.memo(({ 
  hasActiveFilters, 
  onClearFilters 
}) => {
  const handleClearFilters = React.useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  return (
    <div className={styles.noResults}>
      <FiSearch className={styles.noResultsIcon} />
      <h4>No se encontraron libros</h4>
      {hasActiveFilters && (
        <button className={styles.clearFiltersBtn} onClick={handleClearFilters}>
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );
});

CatalogoEmptyState.displayName = 'CatalogoEmptyState';
export default CatalogoEmptyState;