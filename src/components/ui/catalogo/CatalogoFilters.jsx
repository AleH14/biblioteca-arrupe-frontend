import React from 'react';
import { FiX } from 'react-icons/fi';
import styles from '../../../styles/catalogo.module.css';

const CatalogoFilters = React.memo(({ 
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  uniqueAuthors,
  uniquePublishers,
  filteredBooksCount,
  totalBooksCount,
  activeFiltersCount
}) => {
  const handleFilterChange = React.useCallback((campo, valor) => {
    onFilterChange(campo, valor);
  }, [onFilterChange]);

  const handleClearFilters = React.useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <h4>Filtros Avanzados</h4>
        {activeFiltersCount > 0 && (
          <button className={styles.clearAllButton} onClick={handleClearFilters}>
            <FiX />
            Limpiar filtros ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label>Autor</label>
          <select 
            value={filters.autor} 
            onChange={(e) => handleFilterChange("autor", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los autores</option>
            {uniqueAuthors.map(autor => (
              <option key={autor} value={autor}>{autor}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Editorial</label>
          <select 
            value={filters.editorial} 
            onChange={(e) => handleFilterChange("editorial", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las editoriales</option>
            {uniquePublishers.map(editorial => (
              <option key={editorial} value={editorial}>{editorial}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Categoría</label>
          <select 
            value={filters.categoria} 
            onChange={(e) => handleFilterChange("categoria", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.descripcion}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo</label>
          <select 
            value={filters.tipo} 
            onChange={(e) => handleFilterChange("tipo", e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los tipos</option>
            <option value="donado">Donado</option>
            <option value="comprado">Comprado</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Ejemplares (mín)</label>
          <input
            type="number"
            placeholder="Mínimo"
            value={filters.ejemplaresMin}
            onChange={(e) => handleFilterChange("ejemplaresMin", e.target.value)}
            className={styles.filterInput}
            min="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Ejemplares (máx)</label>
          <input
            type="number"
            placeholder="Máximo"
            value={filters.ejemplaresMax}
            onChange={(e) => handleFilterChange("ejemplaresMax", e.target.value)}
            className={styles.filterInput}
            min="0"
          />
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          {filteredBooksCount} de {totalBooksCount} libros encontrados
        </span>
      </div>
    </div>
  );
});

CatalogoFilters.displayName = 'CatalogoFilters';
export default CatalogoFilters;