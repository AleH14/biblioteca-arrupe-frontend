"use client";
import React from "react";
import { FiX } from "react-icons/fi";
import styles from "../../../styles/IntEstudiantes.module.css";

const FiltersEstudiante = React.memo(
  ({
    filters,
    onFilterChange,
    onClearFilters,
    categories = [],
    uniqueAuthors = [],
    uniquePublishers = [],
    activeFiltersCount,
    filteredBooksCount,
    totalBooksCount,
  }) => {

    const handleFilterChange = React.useCallback(
      (field, value) => {
        // Pasamos un objeto con la propiedad a actualizar
        onFilterChange({ [field]: value });
      },
      [onFilterChange]
    );

    const handleClearFilters = React.useCallback(() => {
      onClearFilters();
    }, [onClearFilters]);

    return (
      <div className={styles.filtersPanel}>
        <div className={styles.filtersHeader}>
          <h4>Filtros de Búsqueda</h4>
          <button
            className={styles.clearAllButton}
            onClick={handleClearFilters}
            disabled={activeFiltersCount === 0}
          >
            <FiX size={16} />
            Limpiar filtros ({activeFiltersCount})
          </button>
        </div>

        <div className={styles.filtersGrid}>
          {/* Filtro por Categoría */}
          <div className={styles.filterGroup}>
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              className={styles.filterSelect}
              value={filters.categoria || ""}
              onChange={(e) => handleFilterChange("categoria", e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Autor */}
          <div className={styles.filterGroup}>
            <label htmlFor="autor">Autor</label>
            <select
              id="autor"
              className={styles.filterSelect}
              value={filters.autor || ""}
              onChange={(e) => handleFilterChange("autor", e.target.value)}
            >
              <option value="">Todos los autores</option>
              {uniqueAuthors.map((autor) => (
                <option key={autor} value={autor}>
                  {autor}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Editorial */}
          <div className={styles.filterGroup}>
            <label htmlFor="editorial">Editorial</label>
            <select
              id="editorial"
              className={styles.filterSelect}
              value={filters.editorial || ""}
              onChange={(e) => handleFilterChange("editorial", e.target.value)}
            >
              <option value="">Todas las editoriales</option>
              {uniquePublishers.map((editorial) => (
                <option key={editorial} value={editorial}>
                  {editorial}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.resultsInfo}>
          {filteredBooksCount} libros encontrados
        </div>
      </div>
    );
  }
);

FiltersEstudiante.displayName = "FiltersEstudiante";
export default FiltersEstudiante;
