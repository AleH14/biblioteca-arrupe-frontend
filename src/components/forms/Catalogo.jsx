"use client";
import React, { useState } from "react";
import styles from "../../styles/Catalogo.module.css";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

export default function Catalogo({ volverMenu }) {
  const [libros, setLibros] = useState([
    {
      id: 1,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Sudamericana",
      ejemplares: 15,
      portada: "/images/libros/100.jpg",
      isbn: "8423919005",
    },
    {
      id: 2,
      titulo: "Un día en la vida",
      autor: "Manlio Argueta",
      editorial: "UCA",
      ejemplares: 10,
      portada: "/images/libros/undiaenlavida.jpg",
      isbn: "9789992302343",
    },
    {
      id: 3,
      titulo: "Vecinas",
      autor: "Santiago Nogales",
      editorial: "Loqueleo Santillana",
      ejemplares: 7,
      portada: "/images/libros/vecinas.jpg",
      isbn: "9788467591735",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);

  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    ejemplares: "",
    portada: "",
    isbn: "",
  });

  const handleChange = (e) => {
    setNuevoLibro({ ...nuevoLibro, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    if (!nuevoLibro.titulo) return;
    setLibros([
      ...libros,
      {
        ...nuevoLibro,
        id: libros.length + 1,
        ejemplares: parseInt(nuevoLibro.ejemplares || 0),
      },
    ]);
    setNuevoLibro({
      titulo: "",
      autor: "",
      editorial: "",
      ejemplares: "",
      portada: "",
      isbn: "",
    });
    setShowAddModal(false);
  };

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
      <div className="container my-3">
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

      {/* Buscador + botón agregar */}
      <div className={`${styles.containerLimit} my-4`}>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            placeholder="Buscar libro"
            className={styles.searchInput}
          />
          <button
            className={global.btnPrimary}
            onClick={() => setShowAddModal(true)}
          >
            + Agregar Libro
          </button>
        </div>
      </div>

      {/* Tarjetas de libros */}
      <div className="container">
        <div className="row justify-content-center g-4">
          {libros.map((libro) => (
            <div key={libro.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
              <div className={styles.card}>
                <img
                  src={libro.portada}
                  alt={libro.titulo}
                  className={styles.cover}
                />
                <div className="p-2 text-center">
                  <h5>{libro.titulo}</h5>
                  <p>{libro.autor}</p>
                  <p className="text-muted">{libro.editorial}</p>
                  <p className={styles.ejemplares}>
                    Ejemplares: {libro.ejemplares}
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-1">
                    <button className={global.btnWarning}>Editar</button>
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
