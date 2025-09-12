"use client";
import React, { useState } from "react";
import styles from "../../styles/PrestamoVista.module.css";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import DatePicker from "react-datepicker"; //para fechas de modal de prestamo
import "react-datepicker/dist/react-datepicker.css";

export default function PrestamoVista({ volverMenu }) {
  const prestamos = [
    {
      id: 1,
      usuario: "Nombre de Usuario",
      libro: "Libro Prestado",
      fecha: "12/09/2025",
      estado: "Activo",
    },
    {
      id: 2,
      usuario: "Nombre de Usuario",
      libro: "Libro Prestado",
      fecha: "05/09/2025",
      estado: "Entrega Retrasada",
    },
    {
      id: 3,
      usuario: "Nombre de Usuario",
      libro: "Libro Prestado",
      fecha: "03/09/2025",
      estado: "Entrega Retrasada",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [ejemplaresSeleccionados, setEjemplaresSeleccionados] = useState([""]);

  // Estado para las fechas
  const [fechaPrestamo, setFechaPrestamo] = useState(null);
  const [fechaDevolucion, setFechaDevolucion] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleEjemplarChange = (index, value) => {
    const newEjemplares = [...ejemplaresSeleccionados];
    newEjemplares[index] = value;
    setEjemplaresSeleccionados(newEjemplares);
  };

  const addEjemplar = () =>
    setEjemplaresSeleccionados([...ejemplaresSeleccionados, ""]);
  const removeEjemplar = (index) =>
    setEjemplaresSeleccionados(
      ejemplaresSeleccionados.filter((_, i) => i !== index)
    );

  return (
    <div className={global.backgroundWrapper}>
      {/* Header */}
      <header
        className={`${global.header} d-flex justify-content-between align-items-center`}
      >
        <button className={global.homeBtn} onClick={volverMenu}>
          <FiHome className={global.homeIcon} />
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span>Cerrar sesión</span>
        </button>
      </header>

      {/* Título */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={global.complementoImg + " me-2"}
              />
              <h1 className={`${global.title} mb-0`}>Préstamos</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y botón nuevo préstamo */}
      <div className={`${styles.containerLimit} my-4`}>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            placeholder="Buscar préstamo"
            className={styles.searchInput}
          />
          <button className={global.btnPrimary} onClick={handleShow}>
            <span className={global.btnPrimaryMas}>+</span> Nuevo Préstamo
          </button>
        </div>
      </div>

      {/* Listado de préstamos */}
      <div className={styles.containerLimit}>
        {prestamos.map((p) => (
          <div key={p.id} className={styles.card}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100">
              <div className="text-start text-center text-md-start">
                <strong>{p.usuario}</strong>
                <br />
                <small>{p.libro}</small>
              </div>
              <div className="text-center my-2 my-md-0">
                <span
                  className={
                    p.estado === "Activo"
                      ? styles.estadoActivo
                      : styles.estadoRetrasado
                  }
                >
                  {p.estado}
                </span>
                <br />
                <small className={styles.fecha}>{p.fecha}</small>
              </div>
              <button className={global.btnSecondary}>Devolver</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de NUEVO PRÉSTAMO*/}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Préstamo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">

                {/*------------------ Formulario ----------------------*/}
                <form>
                  {/* Nombre del Estudiante */}
                  <div className="mb-3">
                    <label className="form-label">Nombre del Estudiante</label>
                    <input
                      type="text"
                      name="estudiante"
                      className={`${styles.inputForm} form-control`}
                      placeholder="Ingrese nombre"
                      required
                    />
                  </div>
                  {/* Ejemplares */}
                  <label className="form-label">Ejemplar</label><br></br>
                  {ejemplaresSeleccionados.map((ej, index) => (
                    <div className="mb-3 d-flex" key={index}>
                      <input
                        type="text"
                        value={ej}
                        onChange={(e) =>
                          handleEjemplarChange(index, e.target.value)
                        }
                        className={`${styles.inputForm} form-control me-2`}
                        placeholder="Ejemplar"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => removeEjemplar(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={addEjemplar}
                  >
                    + Añadir otro Ejemplar
                  </button>

                  {/* Fechas */}
                  <div className="mb-3">
                    <label className="form-label">Fecha de Préstamo</label>
                    <div>
                      <DatePicker
                        selected={fechaPrestamo}
                        onChange={(date) => setFechaPrestamo(date)}
                        className={`${styles.inputForm} form-control`}
                        placeholderText="Selecciona fecha"
                        dateFormat="dd/MM/yyyy"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fecha de Devolución</label>
                    <div>
                      <DatePicker
                        selected={fechaDevolucion}
                        onChange={(date) => setFechaDevolucion(date)}
                        className={`${styles.inputForm} form-control`}
                        placeholderText="Selecciona fecha"
                        dateFormat="dd/MM/yyyy"
                        required
                      />
                    </div>
                  </div>

                  {/* Correo */}
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                      type="email"
                      className={`${styles.inputForm} form-control`}
                      name="correo"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                  <button type="button" className={global.btnPrimary}>
                    Guardar Préstamo
                  </button>
                </form>

                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
