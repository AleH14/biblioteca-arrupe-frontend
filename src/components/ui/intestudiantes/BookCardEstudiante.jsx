import React from 'react';
import global from '../../../styles/Global.module.css';
import styles from '../../../styles/IntEstudiantes.module.css';

const BookCardEstudiante = React.memo(({ 
  libro,
  onReserve 
}) => {
  const handleReserveClick = React.useCallback(() => {
    onReserve(libro);
  }, [libro, onReserve]);

  return (
    <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center mb-3">
      <div className={`${styles.card} ${libro.disponibles === 0 ? styles.cardUnavailable : ''}`}>
        <div className={styles.coverWrapper}>
          <img
            src={libro.portada}
            alt={libro.titulo}
            className={styles.cover}
            loading="lazy"
          />
          {libro.disponibles === 0 && (
            <div className={styles.unavailableBadge}>No Disponible</div>
          )}
        </div>
        <div className="p-2 text-center">
          <h5 className={styles.bookTitle}>{libro.titulo}</h5>
          <p className={styles.bookAuthor}>{libro.autor}</p>
          <p className={styles.bookEditorial}>{libro.editorial}</p>
          <p className={styles.ejemplares}>
            Disponibles: <span className={libro.disponibles > 0 ? styles.available : styles.unavailable}>
              {libro.disponibles}
            </span>
          </p>
          <div className="d-flex justify-content-center gap-2 mt-1">
            <button
              className={`${global.btnWarning} ${styles.reserveBtn}`}
              onClick={handleReserveClick}
              disabled={libro.disponibles === 0}
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

BookCardEstudiante.displayName = 'BookCardEstudiante';
export default BookCardEstudiante;