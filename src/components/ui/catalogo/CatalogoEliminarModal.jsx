import React from 'react';
import global from '../../../styles/Global.module.css';
import styles from '../../../styles/catalogo.module.css';

const CatalogoEliminarModal = React.memo(({ 
  show, 
  libro, 
  onClose, 
  onConfirm,
  contarTotalEjemplares 
}) => {
  const totalEjemplares = React.useMemo(() => 
    libro ? contarTotalEjemplares(libro.ejemplares) : 0, 
    [libro, contarTotalEjemplares]
  );

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const handleConfirm = React.useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  if (!show || !libro) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.deleteTitle}>ELIMINAR LIBRO</h3>
          <button onClick={handleClose}>✖</button>
        </div>
        <div className={styles.modalBody}>
          <p>¿Seguro que deseas eliminar <b>{libro.titulo}</b>?</p>
          <label className={styles.modalLabel}>Autor</label>
          <input type="text" value={libro.autor} readOnly />
          <label>Editorial</label>
          <input type="text" value={libro.editorial} readOnly />
          <label>ISBN</label>
          <input type="text" value={libro.isbn} readOnly />
          <label>Ejemplares</label>
          <input type="number" value={totalEjemplares} readOnly />
        </div>
        <div className={styles.modalFooter}>
          <p className={styles.deleteWarning}>Se eliminarán todos los ejemplares de este libro.</p>
          <div className="d-flex justify-content-center gap-2 mt-1">
            <button className={global.btnSecondary} onClick={handleConfirm}>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

CatalogoEliminarModal.displayName = 'CatalogoEliminarModal';
export default CatalogoEliminarModal;