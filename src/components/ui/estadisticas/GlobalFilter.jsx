import React from "react";
import styles from "../../../styles/estadisticas.module.css";

export default function GlobalFilter({ filtroGlobal, setFiltroGlobal }) {
  return (
    <div className="container mb-4">
      <div className="row justify-content-center">
        <div className="col-auto">
          <div className={styles.globalFilters}>
            {["hoy", "mensual", "anual"].map((periodo) => (
              <button
                key={periodo}
                className={`${styles.globalFilter} ${filtroGlobal === periodo ? styles.active : ""}`}
                onClick={() => setFiltroGlobal(periodo)}
              >
                {periodo === "hoy" ? "Hoy" : periodo === "mensual" ? "Este Mes" : "Este Año"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
