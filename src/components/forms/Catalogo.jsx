"use client";
import React, { useState } from "react";
import styles from "../../styles/catalogo.module.css";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import EditarLibro from "./EditarLibro";// Importar EditarLibro
import AgregarLibro from "./AgregarLibro"; // Importar AgregarLibro

export default function Catalogo({ volverMenu }) {
  const [libros, setLibros] = useState([
    {
      id: 1,
      titulo: "Don Quijote de la Manchaaaaaa",
      autor: "Miguel de Cervantes Saavedra",
      editorial: "Signet Classics",
      ejemplares: 15,
      portada: "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780451525079",
    },
    {
      id: 2,
      titulo: "Un día en la vida",
      autor: "Manlio Argueta",
      editorial: "UCA",
      ejemplares: 10,
      portada: "http://books.google.com/books/content?id=qg9fAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780394722160",
    },
    {
      id: 3,
      titulo: "Vecinas",
      autor: "Santiago Nogales",
      editorial: "Loqueleo Santillana",
      ejemplares: 7,
      portada: "http://books.google.com/books/content?id=Rtk8PgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9788467591735",
    },
    {
      id: 4,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: 15,
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
    },
    {
      id: 5,
      titulo: "El oro del rey / The King's Gold",
      autor: "Arturo Pérez-Reverte",
      editorial: "Alfaguara",
      ejemplares: 15,
      portada: "http://books.google.com/books/content?id=MURfAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "8423919005",
    },
    {
      id: 6,
      titulo: "Pasos perdidos",
      autor: "Gabriel García Márquez",
      editorial: "Sudamericana",
      ejemplares: 15,
      portada: "http://books.google.com/books/content?id=PuleAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780374521998",
    },
    {
      id: 7,
      titulo: "Le petit prince",
      autor: "Antoine de Saint-Exupéry",
      editorial: "Sudamericana",
      ejemplares: 15,
      portada: "http://books.google.com/books/content?id=Zf2APwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "8423919005",
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [mostrarEditarLibro, setMostrarEditarLibro] = useState(false);
  const [libroAEditar, setLibroAEditar] = useState(null);
  const [mostrarAgregarLibro, setMostrarAgregarLibro] = useState(false); 

  const handleEditar = (libro) => {
    setLibroAEditar(libro);
    setMostrarEditarLibro(true);
  };

  const handleVolverCatalogo = () => {
    setMostrarEditarLibro(false);
    setLibroAEditar(null);
    setMostrarAgregarLibro(false); 
  };

  const handleAgregarLibro = () => {
    setMostrarAgregarLibro(true); 
  };

  //REDIRECCIÓN A PANTALLA DE AGREGAR LIBRO
  if (mostrarAgregarLibro) {
    return <AgregarLibro volverCatalogo={handleVolverCatalogo} />;
  }

  //REDIRECCIÓN A PANTALLA DE EDITAR LIBRO
  if (mostrarEditarLibro && libroAEditar) {
    return (
      <EditarLibro 
        volverCatalogo={handleVolverCatalogo} 
        libro={libroAEditar} 
      />
    );
  }

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
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </header>

      {/* Título */}
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={global.complementoImg + " me-2"}
              />
              <h1 className={`${global.title} mb-0`}>Catálogo</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y botón Agregar Libro */}
      <div className={`${styles.containerLimit} my-4`}>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            placeholder="Buscar libro"
            className={styles.searchInput}
          />
          <button className={global.btnPrimary} onClick={handleAgregarLibro}>
            <span className={global.btnPrimaryMas}>+</span> Agregar Libro
          </button>
        </div>
      </div>

      {/* Tarjetas de libros */}
      <div className="container">
        <div className="row justify-content-center g-2 g-lg-3">
          {libros.map((libro) => (
            <div
              key={libro.id}
              className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center mb-3"
            >
              <div className={styles.card}>
                <div className={styles.coverWrapper}>
                  <img
                    src={libro.portada}
                    alt={libro.titulo}
                    className={styles.cover}
                  />
                </div>
                <div className="p-2 text-center">
                  <h5>{libro.titulo}</h5>
                  <p>{libro.autor}</p>
                  <p className="text-muted">{libro.editorial}</p>
                  <p className={styles.ejemplares}>
                    Ejemplares: {libro.ejemplares}
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-1">
                    <button
                      className={global.btnWarning}
                      onClick={() => handleEditar(libro)}
                    >
                      Editar
                    </button>
                    <button
                      className={global.btnSecondary}
                      onClick={() => {
                        setLibroAEliminar(libro);
                        setShowDeleteModal(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL ELIMINAR */}
      {showDeleteModal && libroAEliminar && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.deleteTitle}>ELIMINAR LIBRO</h3>
              <button onClick={() => setShowDeleteModal(false)}>✖</button>
            </div>

            <div className={styles.modalBody}>
              <p>
                ¿Seguro que deseas eliminar <b>{libroAEliminar.titulo}</b>?
              </p>

              <label className={styles.modalLabel}>Autor</label>
              <input type="text" value={libroAEliminar.autor} readOnly />

              <label>Editorial</label>
              <input type="text" value={libroAEliminar.editorial} readOnly />

              <label>ISBN</label>
              <input type="text" value={libroAEliminar.isbn} readOnly />

              <label>Ejemplares</label>
              <input type="number" value={libroAEliminar.ejemplares} readOnly />
            </div>

            <div className={styles.modalFooter}>
              <p className={styles.deleteWarning}>
                Se eliminarán todos los ejemplares de este libro.
              </p>

              <div className="d-flex justify-content-center gap-2 mt-1">
                <button
                  className={global.btnSecondary}
                  onClick={() => {
                    setLibros(libros.filter((l) => l.id !== libroAEliminar.id));
                    setLibroAEliminar(null);
                    setShowDeleteModal(false);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}