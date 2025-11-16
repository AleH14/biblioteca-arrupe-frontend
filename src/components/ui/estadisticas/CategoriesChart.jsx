import React from "react";
import styles from "../../../styles/estadisticas.module.css";

export default function CategoriesChart({ categorias, setCategoriaSeleccionada }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>Distribución por Categorías</h3>
        <span className={styles.chartPeriod}>Haz click para ver libros</span>
      </div>
      <div className={styles.categoriesList}>
        {categorias.map((cat) => (
          <div
            key={cat._id}
            className={styles.categoryItem}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            <span className={styles.categoryName}>{cat.nombre}</span>
            <div className={styles.categoryBar}>
              <div
                className={styles.categoryFill}
                style={{
                  width: `${cat.porcentaje}%`,
                  backgroundColor: cat.color,
                }}
              ></div>
            </div>
            <span className={styles.categoryPercent}>{cat.porcentaje}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
