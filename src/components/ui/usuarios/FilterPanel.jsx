"use client";
import React from "react";
import styles from "../../../styles/Usuarios.module.css";

const FilterPanel = ({ roles, filtroActivo, setFiltroActivo }) => {
  return (
    <div className={styles.sidebarPanel}>
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Categorías</label>

        <div className={styles.filterButtons}>
          {roles.map((rol) => (
            <button
              key={rol.value}
              className={`${styles.filterBtn} ${
                filtroActivo === rol.value ? styles.filterBtnActive : ""
              }`}
              onClick={() => setFiltroActivo(rol.value)}
            >
              {rol.label}
            </button>
          ))}

          {/* Nuevo botón para deshabilitados */}
          <button
            key="deshabilitados"
            className={`${styles.filterBtn} ${
              filtroActivo === "deshabilitados" ? styles.filterBtnActive : ""
            }`}
            onClick={() => setFiltroActivo("deshabilitados")}
          >
            Deshabilitados
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
