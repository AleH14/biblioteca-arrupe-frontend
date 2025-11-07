import React from 'react';
import { FiX } from 'react-icons/fi';
import { MdDateRange } from 'react-icons/md';
import styles from '../../../styles/IntEstudiantes.module.css';

// Función helper para detectar el origen de la imagen
const getImageSource = (imageUrl) => {
  if (!imageUrl) return null;

  const url = imageUrl.toLowerCase();

  if (
    url.includes("google.com") ||
    url.includes("googleapis.com") ||
    url.includes("gstatic.com")
  ) {
    return "google";
  }

  if (url.includes("creazilla.com")) {
    return "creazilla";
  }

  return null;
};

const ReservationModal = React.memo(({ 
  show, 
  libro, 
  onClose, 
  onConfirm 
}) => {
  if (!show || !libro) return null;

  const reservationDate = new Date().toLocaleDateString('es-ES');
  //3 días en milisegundos
  const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES');

  // Obtener la descripción de la categoría
  const getCategoriaDescripcion = () => {
    const categorias = [
      { _id: "1", descripcion: "Literatura" },
      { _id: "2", descripcion: "Ciencia" },
      { _id: "3", descripcion: "Tecnología" },
      { _id: "4", descripcion: "Historia" },
      { _id: "5", descripcion: "Filosofía" },
    ];
    const categoria = categorias.find(cat => cat._id === libro.categoriaId);
    return categoria ? categoria.descripcion : "Sin categoría";
  };

  // Obtener el origen de la imagen actual
  const imageSource = getImageSource(libro.portada);

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
              <span className={styles.modalCategory}>
                {getCategoriaDescripcion()}
              </span>
              {/* Créditos de imagen */}
              {imageSource === "google" && (
                <div className={styles.imageCredit}>
                   <span className={styles.creditText}>
                    Imagen: 
                  </span>
                  <img
                    src="https://books.google.com/googlebooks/images/poweredby.png?hl=es-419"
                    alt="Google Books"
                    className={styles.googleBooksIcon}
                  />
                </div>
              )}
              {imageSource === "creazilla" && (
                <div className={styles.imageCredit}>
                  <span className={styles.creditText}>
                    Imagen vía Creazilla.com
                  </span>
                </div>
              )}
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
            {/* Eliminada la sección de disponibilidad */}
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
            <p>La reserva estará activa por 3 días. Debes recoger el libro antes de esta fecha.</p>
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