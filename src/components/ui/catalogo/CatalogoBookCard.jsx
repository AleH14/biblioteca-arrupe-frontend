import React from "react";
import global from "../../../styles/Global.module.css";
import styles from "../../../styles/catalogo.module.css";

const CatalogoBookCard = React.memo(
  ({ libro, categoria, onEdit, onDelete, contarTotalEjemplares }) => {
    const totalEjemplares = React.useMemo(
      () => contarTotalEjemplares(libro.ejemplares),
      [libro.ejemplares, contarTotalEjemplares]
    );

    const handleEdit = React.useCallback(() => {
      onEdit(libro);
    }, [onEdit, libro]);

    const handleDelete = React.useCallback(() => {
      onDelete(libro);
    }, [onDelete, libro]);

    return (
      <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center mb-3">
        <div className={styles.card}>
          <div className={styles.coverWrapper}>
            <img
              src={libro.portada}
              alt={libro.titulo}
              className={styles.cover}
              loading="lazy"
              width="120"
              height="160"
            />
          </div>
          <div className="p-2 text-center">
            <h5 className={styles.bookTitle}>{libro.titulo}</h5>
            <p className={styles.bookAuthor}>{libro.autor}</p>
            <p className={styles.bookEditorial}>{libro.editorial}</p>
            {categoria && (
              <p className={styles.bookCategory}>{categoria.descripcion}</p>
            )}
            {libro.origen && (
              <p className={styles.bookOrigen}>{libro.origen}</p>
            )}
            <p className={styles.ejemplares}>{totalEjemplares} ejemplares</p>
            {!libro.donado && libro.precio && (
              <p className={styles.ejemplares}>${libro.precio}</p>
            )}
            <div className="d-flex justify-content-center gap-2 mt-1">
              <button
                className={`btn-warning btn-sm px-3 ${global.btnWarning} ${styles.btnUniforme}`}
                onClick={handleEdit}
              >
                Editar
              </button>
              <button
                className={`btn-secondary btn-sm px-3 ${global.btnSecondary} ${styles.btnUniforme}`}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CatalogoBookCard.displayName = "CatalogoBookCard";
export default CatalogoBookCard;
