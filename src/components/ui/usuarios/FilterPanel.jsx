"use client";
import React from "react";
import styles from "../../../styles/Usuarios.module.css";

const roles = ["Todos", "Bibliotecario", "Administrativo", "Colaborador", "Estudiante"];

const FilterPanel = ({ filtroActivo, setFiltroActivo }) => {
  return (
    <div className={styles.sidebarPanel}>
      <div className={styles.filterSection}>
        <label className={styles.filterLabel}>Categorías</label>
        <div className={styles.filterButtons}>
          {roles.map((rol) => {
            const nombreMostrar =
              rol === "Todos"
                ? "Todos"
                : rol === "Colaborador"
                ? "Colaboradores"
                : rol + "s";

            return (
              <button
                key={rol}
                className={`${styles.filterBtn} ${
                  filtroActivo === rol ? styles.filterBtnActive : ""
                }`}
                onClick={() => setFiltroActivo(rol)}
              >
                {nombreMostrar}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
