"use client";
import React, { useState } from "react";
import styles from "../../styles/catalogo.module.css";
import global from "../../styles/Global.module.css";
import { FiHome, FiSearch, FiFilter, FiX } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import EditarLibro from "./EditarLibro";
import AgregarLibro from "./AgregarLibro";

export default function Catalogo({ volverMenu }) {
  const categorias = [
    { _id: "1", descripcion: "Literatura" },
    { _id: "2", descripcion: "Ciencia" },
    { _id: "3", descripcion: "Tecnología" },
    { _id: "4", descripcion: "Historia" },
    { _id: "5", descripcion: "Filosofía" },
  ];

  const [libros, setLibros] = useState([
    {
      id: 1,
      titulo: "Don Quijote de la Mancha",
      autor: "Miguel de Cervantes Saavedra",
      editorial: "Signet Classics",
      ejemplares: [
        { id: 1, estado: "disponible" },
        { id: 2, estado: "disponible" },
        { id: 3, estado: "prestado" }
      ],
      portada: "http://books.google.com/books/content?id=aHM5PwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780451525079",
      categoriaId: "1",
      donado: false,
      origen: null,
      precio: 25.99
    },
    {
      id: 2,
      titulo: "Un día en la vida",
      autor: "Manlio Argueta",
      editorial: "UCA",
      ejemplares: [
        { id: 4, estado: "disponible" },
        { id: 5, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=qg9fAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780394722160",
      categoriaId: "2",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 3,
      titulo: "Vecinas",
      autor: "Santiago Nogales",
      editorial: "Loqueleo Santillana",
      ejemplares: [
        { id: 6, estado: "disponible" },
        { id: 7, estado: "prestado" },
        { id: 8, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=Rtk8PgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9788467591735",
      categoriaId: "3",
      donado: false,
      origen: null,
      precio: 22.75
    },
    {
      id: 4,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 5,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 6,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    },
    {
      id: 7,
      titulo: "100 Años de Soledad",
      autor: "Gabriel García Márquez",
      editorial: "Harper",
      ejemplares: [
        { id: 9, estado: "disponible" },
        { id: 10, estado: "disponible" },
        { id: 11, estado: "disponible" }
      ],
      portada: "http://books.google.com/books/content?id=WV_pAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
      isbn: "9780380015030",
      categoriaId: "4",
      donado: true,
      origen: "Fundación Arrupe",
      precio: null
    }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [mostrarEditarLibro, setMostrarEditarLibro] = useState(false);
  const [libroAEditar, setLibroAEditar] = useState(null);
  const [mostrarAgregarLibro, setMostrarAgregarLibro] = useState(false);

  const [filtros, setFiltros] = useState({
    busqueda: "",
    autor: "",
    editorial: "",
    categoria: "",
    tipo: "",
    ejemplaresMin: "",
    ejemplaresMax: ""
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: "",
      autor: "",
      editorial: "",
      categoria: "",
      tipo: "",
      ejemplaresMin: "",
      ejemplaresMax: ""
    });
  };

  // Función para contar total de ejemplares
  const contarTotalEjemplares = (ejemplares) => {
    return ejemplares.length;
  };

  const librosFiltrados = libros.filter((libro) => {
    const normalize = (txt) =>
      txt?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

    const coincideBusqueda = !filtros.busqueda || 
      normalize(libro.titulo).includes(normalize(filtros.busqueda)) ||
      normalize(libro.autor).includes(normalize(filtros.busqueda)) ||
      normalize(libro.editorial).includes(normalize(filtros.busqueda));

    const coincideAutor = !filtros.autor || normalize(libro.autor) === normalize(filtros.autor);
    const coincideEditorial = !filtros.editorial || normalize(libro.editorial) === normalize(filtros.editorial);
    const coincideCategoria = !filtros.categoria || libro.categoriaId === filtros.categoria;
    const coincideTipo = !filtros.tipo || 
      (filtros.tipo === "donado" ? libro.donado : !libro.donado);
    
    const totalEjemplares = contarTotalEjemplares(libro.ejemplares);
    const ejemplaresMin = filtros.ejemplaresMin ? parseInt(filtros.ejemplaresMin) : 0;
    const ejemplaresMax = filtros.ejemplaresMax ? parseInt(filtros.ejemplaresMax) : Infinity;
    const coincideEjemplares = totalEjemplares >= ejemplaresMin && totalEjemplares <= ejemplaresMax;

    return coincideBusqueda && coincideAutor && coincideEditorial && 
           coincideCategoria && coincideTipo && coincideEjemplares;
  });

  const autoresUnicos = [...new Set(libros.map(libro => libro.autor))];
  const editorialesUnicas = [...new Set(libros.map(libro => libro.editorial))];

  const filtrosActivos = Object.values(filtros).filter(valor => 
    valor !== "" && valor !== null && valor !== undefined
  ).length;

  if (mostrarAgregarLibro) return <AgregarLibro volverCatalogo={handleVolverCatalogo} />;

  if (mostrarEditarLibro && libroAEditar)
    return <EditarLibro volverCatalogo={handleVolverCatalogo} libro={libroAEditar} />;

  return (
    <div className={global.backgroundWrapper}>
      <header className={`${global.header} d-flex justify-content-between align-items-center`}>
        <button className={global.homeBtn} onClick={volverMenu}>
          <FiHome className={global.homeIcon} />
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </header>

      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img src="/images/complemento-1.png" alt="Complemento" className={global.complementoImg + " me-2"} />
              <h1 className={`${global.title} mb-0`}>Catálogo</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.containerLimit}>
          {/* BARRA DE BÚSQUEDA Y ACCIONES EN MISMA LÍNEA */}
          <div className={styles.searchActionsContainer}>
            {/* Búsqueda con diseño gris sin bordes */}
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar por título, autor o editorial..."
                className={styles.searchInput}
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange("busqueda", e.target.value)}
              />
            </div>

            {/* Botones de acción */}
            <div className={styles.actionsWrapper}>
              <button 
                className={`${styles.filterButton} ${mostrarFiltros ? styles.filterButtonActive : ''}`}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <FiFilter />
                Filtros
                {filtrosActivos > 0 && (
                  <span className={styles.filterCounter}>{filtrosActivos}</span>
                )}
              </button>
              
              <button className={global.btnPrimary} onClick={handleAgregarLibro}>
                <span className={global.btnPrimaryMas}>+</span> Agregar Libro
              </button>
            </div>
          </div>

          {/* PANEL DE FILTROS - SE EXPANDE HACIA ABAJO */}
          {mostrarFiltros && (
            <div className={styles.filtersPanel}>
              <div className={styles.filtersHeader}>
                <h4>Filtros Avanzados</h4>
                {filtrosActivos > 0 && (
                  <button className={styles.clearAllButton} onClick={limpiarFiltros}>
                    <FiX />
                    Limpiar filtros ({filtrosActivos})
                  </button>
                )}
              </div>

              <div className={styles.filtersGrid}>
                <div className={styles.filterGroup}>
                  <label>Autor</label>
                  <select 
                    value={filtros.autor} 
                    onChange={(e) => handleFiltroChange("autor", e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">Todos los autores</option>
                    {autoresUnicos.map(autor => (
                      <option key={autor} value={autor}>{autor}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Editorial</label>
                  <select 
                    value={filtros.editorial} 
                    onChange={(e) => handleFiltroChange("editorial", e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">Todas las editoriales</option>
                    {editorialesUnicas.map(editorial => (
                      <option key={editorial} value={editorial}>{editorial}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Categoría</label>
                  <select 
                    value={filtros.categoria} 
                    onChange={(e) => handleFiltroChange("categoria", e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.descripcion}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Tipo</label>
                  <select 
                    value={filtros.tipo} 
                    onChange={(e) => handleFiltroChange("tipo", e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">Todos los tipos</option>
                    <option value="donado">Donado</option>
                    <option value="comprado">Comprado</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Ejemplares (mín)</label>
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={filtros.ejemplaresMin}
                    onChange={(e) => handleFiltroChange("ejemplaresMin", e.target.value)}
                    className={styles.filterInput}
                    min="0"
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label>Ejemplares (máx)</label>
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={filtros.ejemplaresMax}
                    onChange={(e) => handleFiltroChange("ejemplaresMax", e.target.value)}
                    className={styles.filterInput}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.resultsInfo}>
                <span className={styles.resultsCount}>
                  {librosFiltrados.length} de {libros.length} libros encontrados
                </span>
              </div>
            </div>
          )}
        </div>

        {/* LISTA DE LIBROS - MISMO ANCHO QUE EL CONTENEDOR SUPERIOR */}
        <div className="row justify-content-center g-2 g-lg-3">
          {librosFiltrados.map((libro) => {
            const categoria = categorias.find(cat => cat._id === libro.categoriaId);
            const totalEjemplares = contarTotalEjemplares(libro.ejemplares);
            
            return (
              <div key={libro.id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center mb-3">
                <div className={styles.card}>
                  <div className={styles.coverWrapper}>
                    <img src={libro.portada} alt={libro.titulo} className={styles.cover} />
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
                    <p className={styles.ejemplares}>
                      {totalEjemplares} ejemplares
                    </p>
                    {/* Solo mostrar precio si NO es donado */}
                    {!libro.donado && libro.precio && (
                      <p className={styles.ejemplares}>${libro.precio}</p>
                    )}
                    <div className="d-flex justify-content-center gap-2 mt-1">
                      <button className={`${global.btnWarning} ${styles.btnUniforme}`} onClick={() => handleEditar(libro)}>
                        Editar
                      </button>
                      <button className={`${global.btnSecondary} ${styles.btnUniforme}`} onClick={() => {
                        setLibroAEliminar(libro);
                        setShowDeleteModal(true);
                      }}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ESTADO VACÍO */}
        {librosFiltrados.length === 0 && (
          <div className={styles.noResults}>
            <FiSearch className={styles.noResultsIcon} />
            <h4>No se encontraron libros</h4>
            {filtrosActivos > 0 && (
              <button className={styles.clearFiltersBtn} onClick={limpiarFiltros}>
                Limpiar todos los filtros
              </button>
            )}
          </div>
        )}
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
              <p>¿Seguro que deseas eliminar <b>{libroAEliminar.titulo}</b>?</p>
              <label className={styles.modalLabel}>Autor</label>
              <input type="text" value={libroAEliminar.autor} readOnly />
              <label>Editorial</label>
              <input type="text" value={libroAEliminar.editorial} readOnly />
              <label>ISBN</label>
              <input type="text" value={libroAEliminar.isbn} readOnly />
              <label>Ejemplares</label>
              <input type="number" value={contarTotalEjemplares(libroAEliminar.ejemplares)} readOnly />
            </div>
            <div className={styles.modalFooter}>
              <p className={styles.deleteWarning}>Se eliminarán todos los ejemplares de este libro.</p>
              <div className="d-flex justify-content-center gap-2 mt-1">
                <button className={global.btnSecondary} onClick={() => {
                  setLibros(libros.filter((l) => l.id !== libroAEliminar.id));
                  setLibroAEliminar(null);
                  setShowDeleteModal(false);
                }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}