// ui/agregar_editar_libro/EjemplaresManager.jsx
import React from 'react';
import styles from "../../../styles/librosForm.module.css";
import global from "../../../styles/Global.module.css";

const EjemplaresManager = React.memo(({
  ejemplares,
  onEjemplarChange,
  onAgregarEjemplar,
  onEliminarEjemplar,
  showDeleteButton = true
}) => {
  const handleEjemplarChange = (index, field, value) => {
    onEjemplarChange(index, field, value);
  };

  const agregarEjemplar = () => {
    const nuevoId = ejemplares.length > 0 ? Math.max(...ejemplares.map(e => e.id)) + 1 : 1;
    onAgregarEjemplar(nuevoId);
  };

  // Asegurarse de que todos los campos tengan valores por defecto
  const ejemplaresConValores = ejemplares.map(ejemplar => ({
    id: ejemplar.id || Date.now() + Math.random(),
    codigo: ejemplar.codigo || "",
    ubicacion: ejemplar.ubicacion || "",
    estado: ejemplar.estado || "Disponible",
    edificio: ejemplar.edificio || ""
  }));

  return (
    <div className="mb-4">
      <div className={styles.encabezadoSeccion}>
        <h5 className={styles.tituloSeccion}>Ejemplares</h5>
        <button
          type="button"
          className={global.btnPrimary}
          onClick={agregarEjemplar}
        >
          <span className={global.btnPrimaryMas}>+</span> Agregar Ejemplar
        </button>
      </div>

      {/* Tabla de Ejemplares Responsiva */}
      <div className={styles.tablaResponsive}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Ubicación</th>
              <th>Edificio</th>
              <th>Estado</th>
              {showDeleteButton && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {ejemplaresConValores.map((ejemplar, index) => (
              <tr key={ejemplar.id}>
                <td className="fw-bold">{index + 1}</td>

                {/* Código */}
                <td>
                  <input
                    type="text"
                    value={ejemplar.codigo}
                    onChange={(e) =>
                      handleEjemplarChange(index, "codigo", e.target.value)
                    }
                    className={styles.tablaInput}
                    placeholder="Código del ejemplar"
                  />
                </td>

                {/* Ubicación */}
                <td>
                  <input
                    type="text"
                    value={ejemplar.ubicacion}
                    onChange={(e) =>
                      handleEjemplarChange(index, "ubicacion", e.target.value)
                    }
                    className={styles.tablaInput}
                    placeholder="Ubicación del ejemplar"
                  />
                </td>

                {/* Edificio */}
                <td>
                  <select
                    value={ejemplar.edificio}
                    onChange={(e) =>
                      handleEjemplarChange(index, "edificio", e.target.value)
                    }
                    className={styles.tablaSelect}
                  >
                    <option value="">Seleccione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </td>

                {/* Estado */}
                <td>
                  <select
                    value={ejemplar.estado}
                    onChange={(e) =>
                      handleEjemplarChange(index, "estado", e.target.value)
                    }
                    className={styles.tablaSelect}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Prestado">Prestado</option>
                    <option value="Reservado">Reservado</option>
                  </select>
                </td>

                {/* Acción */}
                {showDeleteButton && (
                  <td>
                    {ejemplares.length > 1 && (
                      <button
                        type="button"
                        className={`${global.btnSecondary} ${styles.eliminarBtn}`}
                        onClick={() => onEliminarEjemplar(ejemplar)}
                      >
                        Eliminar Ejemplar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

EjemplaresManager.displayName = 'EjemplaresManager';

export default EjemplaresManager;