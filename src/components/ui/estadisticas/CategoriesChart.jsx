import React from "react";
import styles from "../../../styles/estadisticas.module.css";

// 🎨 Paleta igual a dashboards modernos (puedes cambiarla)
const COLORES = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
];

export default function CategoriesChart({
  categorias = [],
  setCategoriaSeleccionada,
}) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h3>Distribución por Categorías</h3>
        <span className={styles.chartPeriod}>
          Haz click para ver libros
        </span>
      </div>

      <div className={styles.categoriesList}>
        {categorias.map((cat, index) => {
          const color = COLORES[index % COLORES.length];

          return (
            <div
              key={cat.categoriaId}
              className={styles.categoryItem}
              onClick={() =>
  setCategoriaSeleccionada({
    categoriaId: cat.categoriaId,
    categoria: cat.categoria,
  })
}

            >
              <span className={styles.categoryName}>
                {cat.categoria}
              </span>

              <div className={styles.categoryBar}>
                <div
                  className={styles.categoryFill}
                  style={{
                    width: `${cat.porcentaje.toFixed(1)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>

              <span className={styles.categoryPercent}>
                {cat.porcentaje.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
