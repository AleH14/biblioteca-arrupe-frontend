import React from 'react';
import { FiX } from 'react-icons/fi';
import { MdDateRange } from 'react-icons/md';
import styles from '../../../styles/IntEstudiantes.module.css';

const ReservationModal = React.memo(({ 
  show, 
  libro, 
  onClose, 
  onConfirm 
}) => {
  if (!show || !libro) return null;

  const reservationDate = new Date().toLocaleDateString('es-ES');
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES');

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Confirmar Reserva</h3>
          <button 
            className={styles.modalClose}
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBookInfo}>
            <img src={libro.portada} alt={libro.titulo} />
            <div>
              <h4>{libro.titulo}</h4>
              <p>{libro.autor}</p>
              <span className={styles.modalCategory}>{libro.categoria}</span>
            </div>
          </div>

          <div className={styles.reservationDetails}>
            <div className={styles.detailRow}>
              <span>Editorial:</span>
              <span>{libro.editorial}</span>
            </div>
            <div className={styles.detailRow}>
              <span>ISBN:</span>
              <span>{libro.isbn}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Disponibilidad:</span>
              <span className={libro.disponibles > 0 ? styles.textAvailable : styles.textUnavailable}>
                {libro.disponibles} ejemplares
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>Fecha de Reserva:</span>
              <span>{reservationDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Vence el:</span>
              <span>{dueDate}</span>
            </div>
          </div>

          <div className={styles.reservationNotice}>
            <MdDateRange className={styles.noticeIcon} />
            <p>Tienes 2 días para recoger el libro en la biblioteca.</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.buttonSecondary}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className={styles.buttonPrimary}
            onClick={onConfirm}
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
});

ReservationModal.displayName = 'ReservationModal';
export default ReservationModal;