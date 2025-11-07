import React, { useState } from "react";
import DatePicker from "react-datepicker";
import styles from "../../../styles/PrestamoVista.module.css";

const ConfirmarPrestamoModal = React.memo(
  ({ show, onClose, prestamo, onConfirmar, formatearFecha }) => {
    const [fechaDevolucionEstimada, setFechaDevolucionEstimada] = useState(
      () => {
        // 8 días desde la fecha actual
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + 8);
        return fecha;
      }
    );

    if (!show || !prestamo) return null;

    const fechaPrestamo = new Date();
    const fechaPrestamoFormateada = fechaPrestamo.toLocaleDateString("es-ES");

    return (
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Préstamo</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className={styles.confirmacionContent}>
                {/* Información del libro con portada */}
                <div className="d-flex mb-3">
                  {prestamo.portada && (
                    <div className="me-3">
                      <img
                        src={prestamo.portada}
                        alt={prestamo.libro}
                        className={styles.portadaImagen}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h6 className="mb-1">{prestamo.libro}</h6>
                    <p className="mb-1 text-muted">{prestamo.usuario}</p>
                    <span className="badge bg-warning text-dark">
                      Reservado
                    </span>
                  </div>
                </div>

                {/* Detalles del préstamo */}
                <div className={styles.confirmacionInfo}>
                  <div className="d-flex justify-content-between border-bottom py-2">
                    <span className="fw-medium">Fecha de Préstamo:</span>
                    <span>{fechaPrestamoFormateada}</span>
                  </div>

                  {/* DatePicker para fecha de devolución estimada */}
                  <div className="border-bottom py-2">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <span className="fw-medium">
                          Fecha de Devolución Estimada:
                        </span>
                      </div>
                      <div className="col-md-6">
                        <div className={styles.datepickerContainer}>
                          <div className={styles.datepickerWrapper}>
                            <DatePicker
                              selected={fechaDevolucionEstimada}
                              onChange={setFechaDevolucionEstimada}
                              minDate={fechaPrestamo}
                              className={`${styles.datePickerInput} form-control text-end`}
                              placeholderText="Selecciona fecha de devolución"
                              dateFormat="yyyy-MM-dd"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => onConfirmar(fechaDevolucionEstimada)}
              >
                Confirmar Préstamo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmarPrestamoModal.displayName = "ConfirmarPrestamoModal";

export default ConfirmarPrestamoModal;
