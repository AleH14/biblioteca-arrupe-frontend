"use client";
import React, { useState, useMemo } from "react";
import styles from "../../styles/estadisticas.module.css";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { 
  FiUsers, 
  FiBook, 
  FiCalendar,
  FiAward,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiX
} from "react-icons/fi";

export default function Estadisticas({ volverMenu }) {
  // Estados para controlar la vista y filtros
  const [vistaLibros, setVistaLibros] = useState("masPrestados"); // Controla si se muestran libros más o menos prestados
  const [filtroGlobal, setFiltroGlobal] = useState("hoy"); // Filtro de período: hoy, mensual, anual
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // Categoría seleccionada para modal
  const [mostrarDevolucionesAtrasadas, setMostrarDevolucionesAtrasadas] = useState(false); // Controla modal de devoluciones atrasadas
  const [mostrarLibrosReservados, setMostrarLibrosReservados] = useState(false); // Controla modal de libros reservados

  // Paleta de colores para categorías (36 colores distintos)
  const coloresCategorias = [
    "#dc2626", "#f59e0b", "#000000", "#6b7280", "#059669", "#7c3aed", 
    "#db2777", "#0891b2", "#ca8a04", "#16a34a", "#9333ea", "#e11d48",
    "#0f766e", "#4338ca", "#b45309", "#be185d", "#0d9488", "#1e40af",
    "#65a30d", "#dc2626", "#7c2d12", "#1e3a8a", "#831843", "#0f766e",
    "#3730a3", "#9d174d", "#166534", "#713f12", "#1e40af", "#701a75",
    "#334155", "#854d0e", "#0f766e", "#1e3a8a", "#831843", "#166534"
  ];

  // Datos simulados
  const datosEstadisticas = useMemo(() => {
    // Datos para las cards principales por período (hoy, mensual, anual)
    const metricas = {
      hoy: {
        prestamosTotales: 24,
        prestamosActivos: 8,
        usuariosRegistrados: 15,
        librosBiblioteca: 1560
      },
      mensual: {
        prestamosTotales: 1247,
        prestamosActivos: 89,
        usuariosRegistrados: 542,
        librosBiblioteca: 1560
      },
      anual: {
        prestamosTotales: 14964,
        prestamosActivos: 89,
        usuariosRegistrados: 6504,
        librosBiblioteca: 1560
      }
    };

    // Datos para gráfico de tendencias por período
    const tendencias = {
      hoy: [
        { periodo: "08:00", prestamos: 2 },
        { periodo: "10:00", prestamos: 5 },
        { periodo: "12:00", prestamos: 8 },
        { periodo: "14:00", prestamos: 6 },
        { periodo: "16:00", prestamos: 3 }
      ],
      mensual: [
        { periodo: "Sem 1", prestamos: 45 },
        { periodo: "Sem 2", prestamos: 52 },
        { periodo: "Sem 3", prestamos: 48 },
        { periodo: "Sem 4", prestamos: 61 }
      ],
      anual: [
        { periodo: "Ene", prestamos: 1245 },
        { periodo: "Feb", prestamos: 1320 },
        { periodo: "Mar", prestamos: 1280 },
        { periodo: "Abr", prestamos: 1410 },
        { periodo: "May", prestamos: 1350 },
        { periodo: "Jun", prestamos: 1380 },
        { periodo: "Jul", prestamos: 1220 },
        { periodo: "Ago", prestamos: 1450 },
        { periodo: "Sep", prestamos: 1390 },
        { periodo: "Oct", prestamos: 1330 },
        { periodo: "Nov", prestamos: 1270 },
        { periodo: "Dic", prestamos: 1310 }
      ]
    };

    // Datos de libros basados en esquema de MongoDB
    const libros = [
      { 
        _id: "101", 
        titulo: "Don Quijote de la Mancha", 
        prestamos: 156, 
        autor: "Miguel de Cervantes", 
        categoria: { _id: "cat1", descripcion: "Literatura Clásica" },
        editorial: "Editorial Cervantes",
        isbn: "978-1234567890",
        precio: 250,
        ejemplares: [
          { _id: "ej1", cdu: "863CER", estado: "disponible", ubicacionFisica: "Estante A1" },
          { _id: "ej2", cdu: "863CER", estado: "prestado", ubicacionFisica: "Estante A1" }
        ]
      },
      { 
        _id: "205", 
        titulo: "100 Años de Soledad", 
        prestamos: 134, 
        autor: "Gabriel García Márquez", 
        categoria: { _id: "cat2", descripcion: "Realismo Mágico" },
        editorial: "Editorial Sudamericana",
        isbn: "978-1234567891",
        precio: 180,
        ejemplares: [
          { _id: "ej3", cdu: "863GAR", estado: "disponible", ubicacionFisica: "Estante B2" }
        ]
      },
      { 
        _id: "312", 
        titulo: "El principito", 
        prestamos: 128, 
        autor: "Antoine de Saint-Exupéry", 
        categoria: { _id: "cat3", descripcion: "Literatura Infantil" },
        editorial: "Editorial Francesa",
        isbn: "978-1234567892",
        precio: 120,
        ejemplares: [
          { _id: "ej4", cdu: "843SAI", estado: "disponible", ubicacionFisica: "Estante C3" },
          { _id: "ej5", cdu: "843SAI", estado: "reservado", ubicacionFisica: "Estante C3" }
        ]
      },
      { 
        _id: "413", 
        titulo: "Cien años de soledad", 
        prestamos: 98, 
        autor: "Gabriel García Márquez", 
        categoria: { _id: "cat4", descripcion: "Novela Latinoamericana" },
        editorial: "Editorial Sudamericana",
        isbn: "978-1234567893",
        precio: 200,
        ejemplares: [
          { _id: "ej6", cdu: "863GAR", estado: "disponible", ubicacionFisica: "Estante D4" }
        ]
      },
      { 
        _id: "514", 
        titulo: "Rayuela", 
        prestamos: 76, 
        autor: "Julio Cortázar", 
        categoria: { _id: "cat5", descripcion: "Literatura Experimental" },
        editorial: "Editorial Sudamericana",
        isbn: "978-1234567894",
        precio: 180,
        ejemplares: [
          { _id: "ej7", cdu: "863COR", estado: "disponible", ubicacionFisica: "Estante E5" }
        ]
      },
      { 
        _id: "615", 
        titulo: "La ciudad y los perros", 
        prestamos: 65, 
        autor: "Mario Vargas Llosa", 
        categoria: { _id: "cat6", descripcion: "Novela Contemporánea" },
        editorial: "Editorial Seix Barral",
        isbn: "978-1234567895",
        precio: 190,
        ejemplares: [
          { _id: "ej8", cdu: "863VAR", estado: "disponible", ubicacionFisica: "Estante F6" }
        ]
      },
      { 
        _id: "716", 
        titulo: "Pedro Páramo", 
        prestamos: 54, 
        autor: "Juan Rulfo", 
        categoria: { _id: "cat7", descripcion: "Realismo Mágico" },
        editorial: "Editorial FCE",
        isbn: "978-1234567896",
        precio: 150,
        ejemplares: [
          { _id: "ej9", cdu: "863RUL", estado: "disponible", ubicacionFisica: "Estante G7" }
        ]
      },
      { 
        _id: "817", 
        titulo: "Ficciones", 
        prestamos: 48, 
        autor: "Jorge Luis Borges", 
        categoria: { _id: "cat8", descripcion: "Cuentos Fantásticos" },
        editorial: "Editorial Emece",
        isbn: "978-1234567897",
        precio: 170,
        ejemplares: [
          { _id: "ej10", cdu: "863BOR", estado: "disponible", ubicacionFisica: "Estante H8" }
        ]
      }
    ];

    // Calcular categorías dinámicamente desde los libros usando Map para evitar duplicados
    const categoriasMap = new Map();
    libros.forEach(libro => {
      const catId = libro.categoria._id;
      if (!categoriasMap.has(catId)) {
        categoriasMap.set(catId, {
          _id: catId,
          nombre: libro.categoria.descripcion,
          cantidadLibros: 0,
          cantidadEjemplares: 0,
          totalPrestamos: 0,
          libros: []
        });
      }
      const categoria = categoriasMap.get(catId);
      categoria.cantidadLibros += 1;
      categoria.cantidadEjemplares += libro.ejemplares.length;
      categoria.totalPrestamos += libro.prestamos;
      categoria.libros.push(libro);
    });

    const categoriasArray = Array.from(categoriasMap.values());
    const totalEjemplares = categoriasArray.reduce((sum, cat) => sum + cat.cantidadEjemplares, 0);
    
    // Asignar colores de la paleta ampliada y calcular porcentajes
    const categorias = categoriasArray.map((categoria, index) => {
      const porcentaje = Math.round((categoria.cantidadEjemplares / totalEjemplares) * 100);
      
      return {
        ...categoria,
        porcentaje: porcentaje,
        color: coloresCategorias[index % coloresCategorias.length] // Usa módulo para ciclar colores
      };
    }).sort((a, b) => b.porcentaje - a.porcentaje); // Ordena por porcentaje descendente

    // Datos de devoluciones atrasadas
    const devolucionesAtrasadas = [
      { _id: "1", estudiante: "María González", libro: "Don Quijote de la Mancha", diasAtraso: 5, grado: "10° A" },
      { _id: "2", estudiante: "Carlos Rodríguez", libro: "100 Años de Soledad", diasAtraso: 3, grado: "9° B" },
      { _id: "3", estudiante: "Ana Martínez", libro: "El principito", diasAtraso: 7, grado: "11° C" }
    ];

    // Datos de libros reservados
    const librosReservados = [
      { _id: "1", estudiante: "Laura Hernández", libro: "El principito", fechaReserva: "2024-01-15", grado: "12° B" },
      { _id: "2", estudiante: "Miguel Santos", libro: "Don Quijote de la Mancha", fechaReserva: "2024-01-14", grado: "10° C" },
      { _id: "3", estudiante: "Sofía Ramírez", libro: "Rayuela", fechaReserva: "2024-01-16", grado: "11° A" }
    ];

    return {
      metricas,
      tendencias,
      libros,
      categorias,
      devolucionesAtrasadas,
      librosReservados
    };
  }, []);

  // Calcular TOP 10 de libros más prestados - siempre muestra máximo 10
  const librosMasPrestados = useMemo(() => 
    [...datosEstadisticas.libros]
      .sort((a, b) => b.prestamos - a.prestamos)
      .slice(0, 10), // SOLO PRIMEROS 10 ELEMENTOS
    [datosEstadisticas.libros]
  );

  // Calcular TOP 10 de libros menos prestados - siempre muestra máximo 10
  const librosMenosPrestados = useMemo(() => 
    [...datosEstadisticas.libros]
      .sort((a, b) => a.prestamos - b.prestamos)
      .slice(0, 10), // SOLO PRIMEROS 10 ELEMENTOS
    [datosEstadisticas.libros]
  );

  // Determina qué lista de libros mostrar según la vista seleccionada
  const librosActuales = vistaLibros === "masPrestados" ? librosMasPrestados : librosMenosPrestados;

  // Obtener datos actuales según filtro global seleccionado
  const metricasActuales = datosEstadisticas.metricas[filtroGlobal];
  const tendenciaActual = datosEstadisticas.tendencias[filtroGlobal];

  // Calcular costo total de todos los libros en la biblioteca
  const costoTotalLibros = datosEstadisticas.libros.reduce((total, libro) => {
    return total + (libro.precio * libro.ejemplares.length);
  }, 0);

  // Calcular total de ejemplares en la biblioteca
  const totalEjemplares = datosEstadisticas.libros.reduce((total, libro) => {
    return total + libro.ejemplares.length;
  }, 0);

  // Obtener libros por categoría para el modal
  const getLibrosPorCategoria = (categoriaId) => {
    const categoria = datosEstadisticas.categorias.find(cat => cat._id === categoriaId);
    return categoria ? categoria.libros : [];
  };

  // Calcular altura máxima para el gráfico de barras
  const maxPrestamos = Math.max(...tendenciaActual.map(item => item.prestamos));
  const minHeight = 30; // Altura mínima de barras
  const maxHeight = 180; // Altura máxima de barras

  // Función para calcular altura proporcional de cada barra
  const calcularAlturaBarra = (prestamos) => {
    if (maxPrestamos === 0) return minHeight;
    const proporcion = prestamos / maxPrestamos;
    return minHeight + (proporcion * (maxHeight - minHeight));
  };

  return (
    <div className={global.backgroundWrapper}>
      {/* Header con botones de navegación */}
      <header className={`${global.header} d-flex justify-content-between align-items-center`}>
        <button className={global.homeBtn} onClick={volverMenu}>
          <FiHome className={global.homeIcon} />
        </button>
        <button className={global.logoutBtn}>
          <MdLogout className={global.logoutIcon} />
          <span className="d-none d-sm-inline">Cerrar sesión</span>
        </button>
      </header>

      {/* Título principal de la página */}
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src="/images/complemento-1.png"
                alt="Complemento"
                className={global.complementoImg + " me-2"}
              />
              <h1 className={`${global.title} mb-0`}>Estadísticas</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro Global - Botones para cambiar período de visualización */}
      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className={styles.globalFilters}>
              {["hoy", "mensual", "anual"].map((periodo) => (
                <button
                  key={periodo}
                  className={`${styles.globalFilter} ${filtroGlobal === periodo ? styles.active : ''}`}
                  onClick={() => setFiltroGlobal(periodo)}
                >
                  {periodo === "hoy" ? "Hoy" : periodo === "mensual" ? "Este Mes" : "Este Año"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales - Cards con estadísticas clave */}
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Card: Préstamos Totales */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className={`${styles.metricCard} ${styles.red}`}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <FiBook />
                </div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>{metricasActuales.prestamosTotales.toLocaleString()}</h3>
                  <p className={styles.metricTitle}>Préstamos Totales</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card: Préstamos Activos */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className={`${styles.metricCard} ${styles.gold}`}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <FiCalendar />
                </div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>{metricasActuales.prestamosActivos.toLocaleString()}</h3>
                  <p className={styles.metricTitle}>Préstamos Activos</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card: Estudiantes Registrados */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className={`${styles.metricCard} ${styles.black}`}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <FiUsers />
                </div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>{metricasActuales.usuariosRegistrados.toLocaleString()}</h3>
                  <p className={styles.metricTitle}>Estudiantes Registrados</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card: Libros en Biblioteca */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className={`${styles.metricCard} ${styles.gray}`}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <FiAward />
                </div>
                <div className={styles.metricInfo}>
                  <h3 className={styles.metricValue}>{metricasActuales.librosBiblioteca.toLocaleString()}</h3>
                  <p className={styles.metricTitle}>Libros en Biblioteca</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Gráficos y Listas */}
        <div className="row g-4">
          {/* Gráfico de barras */}
          <div className="col-12 col-lg-7" style={{ marginTop: '40px' }}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>
                  {filtroGlobal === "hoy" ? "Préstamos por Hora - Hoy" : 
                   filtroGlobal === "mensual" ? "Préstamos por Semana - Este Mes" : 
                   "Préstamos por Mes - Este Año"}
                </h3>
                <span className={styles.chartPeriod}>
                  Total: {metricasActuales.prestamosTotales} préstamos
                </span>
              </div>
              <div className={styles.chartContainer}>
                <div className={styles.barChart}>
                  {tendenciaActual.map((item, index) => (
                    <div key={index} className={styles.barContainer}>
                      <div 
                        className={styles.bar} 
                        style={{ height: `${calcularAlturaBarra(item.prestamos)}px` }}
                      >
                        <span className={styles.barValue}>{item.prestamos}</span>
                      </div>
                      <span className={styles.barLabel}>
                        {item.periodo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de libros más/menos prestados - TOP 10 */}
          <div className="col-12 col-lg-5" style={{ marginTop: '30px' }}>
            <div className={styles.listCard}>
              <div className={styles.listHeader}>
                <h3>
                  {vistaLibros === "masPrestados" ? "Libros Más Prestados" : "Libros Menos Prestados"}
                </h3>
                <div className={styles.viewToggle}>
                  <button 
                    className={`${styles.toggleBtn} ${vistaLibros === "masPrestados" ? styles.active : ''}`}
                    onClick={() => setVistaLibros("masPrestados")}
                  >
                    <FiArrowUp /> Más
                  </button>
                  <button 
                    className={`${styles.toggleBtn} ${vistaLibros === "menosPrestados" ? styles.active : ''}`}
                    onClick={() => setVistaLibros("menosPrestados")}
                  >
                    <FiArrowDown /> Menos
                  </button>
                </div>
              </div>
              <div className={styles.listContent}>
                {librosActuales.map((libro, index) => (
                  <div key={libro._id} className={styles.listItem}>
                    <div className={styles.itemRank}>
                      <span className={styles.rankNumber}>{index + 1}</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <h5 className={styles.itemTitle}>{libro.titulo}</h5>
                      <p className={styles.itemSubtitle}>{libro.autor}</p>
                    </div>
                    <div className={styles.itemStats}>
                      <span className={styles.statNumber}>{libro.prestamos}</span>
                      <small>préstamos</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribución por categorías */}
          <div className="col-12 col-lg-6">
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>Distribución por Categorías</h3>
                <span className={styles.chartPeriod}>Haz click para ver libros</span>
              </div>
              <div className={styles.categoriesList}>
                {datosEstadisticas.categorias.map((categoria) => (
                  <div 
                    key={categoria._id}
                    className={styles.categoryItem}
                    onClick={() => setCategoriaSeleccionada(categoria)}
                  >
                    <span className={styles.categoryName}>{categoria.nombre}</span>
                    <div className={styles.categoryBar}>
                      <div 
                        className={styles.categoryFill} 
                        style={{ 
                          width: `${categoria.porcentaje}%`,
                          backgroundColor: categoria.color
                        }}
                      ></div>
                    </div>
                    <span className={styles.categoryPercent}>{categoria.porcentaje}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen de Biblioteca con estadísticas adicionales */}
          <div className="col-12 col-lg-6">
            <div className={styles.statsCard}>
              <div className={styles.statsHeader}>
                <h3>Resumen de Biblioteca</h3>
                <FiTrendingUp className={styles.statsIcon} />
              </div>
              <div className={styles.statsGrid}>
                {/* Item: Devoluciones Atrasadas - clickeable */}
                <div 
                  className={styles.statItem}
                  onClick={() => setMostrarDevolucionesAtrasadas(true)}
                >
                  <span className={styles.statLabel}>Devoluciones Atrasadas</span>
                  <span className={styles.statValue}>{datosEstadisticas.devolucionesAtrasadas.length}</span>
                  <div className={styles.detailText}>
                    <small>Ver detalles</small>
                  </div>
                </div>
                
                {/* Item: Libros Reservados - clickeable */}
                <div 
                  className={styles.statItem}
                  onClick={() => setMostrarLibrosReservados(true)}
                >
                  <span className={styles.statLabel}>Libros Reservados</span>
                  <span className={styles.statValue}>{datosEstadisticas.librosReservados.length}</span>
                  <div className={styles.detailText}>
                    <small>Ver detalles</small>
                  </div>
                </div>
                
                {/* Item: Costo Total Biblioteca */}
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Costo Total Biblioteca</span>
                  <span className={styles.statValue}>${costoTotalLibros.toLocaleString()}</span>
                </div>
                
                {/* Item: Ejemplares Totales */}
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Ejemplares Totales</span>
                  <span className={styles.statValue}>{totalEjemplares}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Categorías - Se muestra al hacer click en una categoría */}
      {categoriaSeleccionada && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Libros de: {categoriaSeleccionada.nombre}</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setCategoriaSeleccionada(null)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalStats}>
                <span>Total de libros: {categoriaSeleccionada.cantidadLibros}</span>
                <span>Ejemplares: {categoriaSeleccionada.cantidadEjemplares}</span>
                <span>Préstamos totales: {categoriaSeleccionada.totalPrestamos}</span>
              </div>
              <div className={styles.modalList}>
                {getLibrosPorCategoria(categoriaSeleccionada._id).map((libro) => (
                  <div key={libro._id} className={styles.modalListItem}>
                    <div className={styles.modalBookInfo}>
                      <h5>{libro.titulo}</h5>
                      <p>{libro.autor}</p>
                      <small>Ejemplares: {libro.ejemplares.length} | Precio: ${libro.precio}</small>
                    </div>
                    <div className={styles.modalBookStats}>
                      <span>{libro.prestamos} préstamos</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Devoluciones Atrasadas */}
      {mostrarDevolucionesAtrasadas && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Devoluciones Atrasadas</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setMostrarDevolucionesAtrasadas(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalList}>
                {datosEstadisticas.devolucionesAtrasadas.map((devolucion) => (
                  <div key={devolucion._id} className={styles.modalListItem}>
                    <div className={styles.modalBookInfo}>
                      <h5>{devolucion.estudiante}</h5>
                      <p>{devolucion.libro}</p>
                      <small>Grado: {devolucion.grado} | {devolucion.diasAtraso} días de atraso</small>
                    </div>
                    <div className={styles.modalBookStats}>
                      <span className={styles.diasAtraso}>{devolucion.diasAtraso}d</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Libros Reservados */}
      {mostrarLibrosReservados && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Libros Reservados</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setMostrarLibrosReservados(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalList}>
                {datosEstadisticas.librosReservados.map((reserva) => (
                  <div key={reserva._id} className={styles.modalListItem}>
                    <div className={styles.modalBookInfo}>
                      <h5>{reserva.estudiante}</h5>
                      <p>{reserva.libro}</p>
                      <small>Grado: {reserva.grado} | Fecha: {reserva.fechaReserva}</small>
                    </div>
                    <div className={styles.modalBookStats}>
                      <span className={styles.reservado}>Reservado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}