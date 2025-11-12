"use client";
import React, { useState, useMemo, useCallback, useRef } from "react";
import styles from "../../styles/estadisticas.module.css";
import { useAuth } from "@/contexts/AuthContext";
import global from "../../styles/Global.module.css";
import { FiHome } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

// Importación de los componentes
import GlobalFilter from "../estadisticas/GlobalFilter";
import MetricCards from "../estadisticas/MetricCards";
import BarChart from "../estadisticas/BarChart";
import TopLibrosList from "../estadisticas/TopLibrosList";
import CategoriesChart from "../estadisticas/CategoriesChart";
import ResumenBiblioteca from "../estadisticas/ResumenBiblioteca";
import ModalCategoria from "../estadisticas/ModalCategoria";
import ModalDevoluciones from "../estadisticas/ModalDevoluciones";
import ModalReservas from "../estadisticas/ModalReservas";
import AppHeader from "../ui/AppHeader";
import PageTitle from "../ui/PageTitle";


export default function Estadisticas({ volverMenu }) {
 

   const { logout } = useAuth();
    // Handlers memoizados
     const handleLogout = useCallback(async () => {
       try {
         await logout();
       } catch (error) {
         console.error("Error durante logout:", error);
       }
     }, [logout]);

    // Estados principales
  const [vistaLibros, setVistaLibros] = useState("masPrestados");
  const [filtroGlobal, setFiltroGlobal] = useState("hoy");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarDevolucionesAtrasadas, setMostrarDevolucionesAtrasadas] = useState(false);
  const [mostrarLibrosReservados, setMostrarLibrosReservados] = useState(false);

  // === Datos simulados y métricas ===
  const datosEstadisticas = useMemo(() => {
    const coloresCategorias = [
      "#dc2626", "#f59e0b", "#000000", "#6b7280", "#059669", "#7c3aed",
      "#db2777", "#0891b2", "#ca8a04", "#16a34a", "#9333ea", "#e11d48",
      "#0f766e", "#4338ca", "#b45309", "#be185d", "#0d9488", "#1e40af",
      "#65a30d", "#dc2626", "#7c2d12", "#1e3a8a", "#831843", "#0f766e",
      "#3730a3", "#9d174d", "#166534", "#713f12", "#1e40af", "#701a75",
      "#334155", "#854d0e", "#0f766e", "#1e3a8a", "#831843", "#166534"
    ];

    const metricas = {
      hoy: {
        prestamosTotales: 24,
        prestamosActivos: 8,
        usuariosRegistrados: 15,
        librosBiblioteca: 1560,
      },
      mensual: {
        prestamosTotales: 1247,
        prestamosActivos: 89,
        usuariosRegistrados: 542,
        librosBiblioteca: 1560,
      },
      anual: {
        prestamosTotales: 14964,
        prestamosActivos: 89,
        usuariosRegistrados: 6504,
        librosBiblioteca: 1560,
      },
    };

    const tendencias = {
      hoy: [
        { periodo: "08:00", prestamos: 2 },
        { periodo: "10:00", prestamos: 5 },
        { periodo: "12:00", prestamos: 8 },
        { periodo: "14:00", prestamos: 6 },
        { periodo: "16:00", prestamos: 3 },
      ],
      mensual: [
        { periodo: "Sem 1", prestamos: 45 },
        { periodo: "Sem 2", prestamos: 52 },
        { periodo: "Sem 3", prestamos: 48 },
        { periodo: "Sem 4", prestamos: 61 },
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
        { periodo: "Dic", prestamos: 1310 },
      ],
    };

    const libros = [
      { _id: "101", titulo: "Don Quijote de la Mancha", prestamos: 156, autor: "Miguel de Cervantes", categoria: { _id: "cat1", descripcion: "Literatura Clásica" }, editorial: "Editorial Cervantes", isbn: "978-1234567890", precio: 250, ejemplares: [{ _id: "ej1", estado: "disponible" }, { _id: "ej2", estado: "prestado" }] },
      { _id: "205", titulo: "100 Años de Soledad", prestamos: 134, autor: "Gabriel García Márquez", categoria: { _id: "cat2", descripcion: "Realismo Mágico" }, editorial: "Editorial Sudamericana", isbn: "978-1234567891", precio: 180, ejemplares: [{ _id: "ej3", estado: "disponible" }] },
      { _id: "312", titulo: "El principito", prestamos: 128, autor: "Antoine de Saint-Exupéry", categoria: { _id: "cat3", descripcion: "Literatura Infantil" }, editorial: "Editorial Francesa", isbn: "978-1234567892", precio: 120, ejemplares: [{ _id: "ej4", estado: "disponible" }, { _id: "ej5", estado: "reservado" }] },
      { _id: "413", titulo: "Cien años de soledad", prestamos: 98, autor: "Gabriel García Márquez", categoria: { _id: "cat4", descripcion: "Novela Latinoamericana" }, editorial: "Editorial Sudamericana", isbn: "978-1234567893", precio: 200, ejemplares: [{ _id: "ej6", estado: "disponible" }] },
      { _id: "514", titulo: "Rayuela", prestamos: 76, autor: "Julio Cortázar", categoria: { _id: "cat5", descripcion: "Literatura Experimental" }, editorial: "Editorial Sudamericana", isbn: "978-1234567894", precio: 180, ejemplares: [{ _id: "ej7", estado: "disponible" }] },
      { _id: "615", titulo: "La ciudad y los perros", prestamos: 65, autor: "Mario Vargas Llosa", categoria: { _id: "cat6", descripcion: "Novela Contemporánea" }, editorial: "Editorial Seix Barral", isbn: "978-1234567895", precio: 190, ejemplares: [{ _id: "ej8", estado: "disponible" }] },
      { _id: "716", titulo: "Pedro Páramo", prestamos: 54, autor: "Juan Rulfo", categoria: { _id: "cat7", descripcion: "Realismo Mágico" }, editorial: "Editorial FCE", isbn: "978-1234567896", precio: 150, ejemplares: [{ _id: "ej9", estado: "disponible" }] },
      { _id: "817", titulo: "Ficciones", prestamos: 48, autor: "Jorge Luis Borges", categoria: { _id: "cat8", descripcion: "Cuentos Fantásticos" }, editorial: "Editorial Emece", isbn: "978-1234567897", precio: 170, ejemplares: [{ _id: "ej10", estado: "disponible" }] },
    ];

    const categoriasMap = new Map();
    libros.forEach((libro) => {
      const catId = libro.categoria._id;
      if (!categoriasMap.has(catId)) {
        categoriasMap.set(catId, {
          _id: catId,
          nombre: libro.categoria.descripcion,
          cantidadLibros: 0,
          cantidadEjemplares: 0,
          totalPrestamos: 0,
          libros: [],
        });
      }
      const categoria = categoriasMap.get(catId);
      categoria.cantidadLibros += 1;
      categoria.cantidadEjemplares += libro.ejemplares.length;
      categoria.totalPrestamos += libro.prestamos;
      categoria.libros.push(libro);
    });

    const categoriasArray = Array.from(categoriasMap.values());
    const totalEjemplares = categoriasArray.reduce((sum, c) => sum + c.cantidadEjemplares, 0);
    const categorias = categoriasArray
      .map((c, i) => ({
        ...c,
        porcentaje: Math.round((c.cantidadEjemplares / totalEjemplares) * 100),
        color: coloresCategorias[i % coloresCategorias.length],
      }))
      .sort((a, b) => b.porcentaje - a.porcentaje);

    const devolucionesAtrasadas = [
      { _id: "1", estudiante: "María González", libro: "Don Quijote de la Mancha", diasAtraso: 5, grado: "10° A" },
      { _id: "2", estudiante: "Carlos Rodríguez", libro: "100 Años de Soledad", diasAtraso: 3, grado: "9° B" },
      { _id: "3", estudiante: "Ana Martínez", libro: "El principito", diasAtraso: 7, grado: "11° C" },
    ];

    const librosReservados = [
      { _id: "1", estudiante: "Laura Hernández", libro: "El principito", fechaReserva: "2024-01-15", grado: "12° B" },
      { _id: "2", estudiante: "Miguel Santos", libro: "Don Quijote de la Mancha", fechaReserva: "2024-01-14", grado: "10° C" },
      { _id: "3", estudiante: "Sofía Ramírez", libro: "Rayuela", fechaReserva: "2024-01-16", grado: "11° A" },
    ];

    return { metricas, tendencias, libros, categorias, devolucionesAtrasadas, librosReservados };
  }, []);

  // === Derivados de datos ===
  const librosMasPrestados = useMemo(
    () => [...datosEstadisticas.libros].sort((a, b) => b.prestamos - a.prestamos).slice(0, 10),
    [datosEstadisticas.libros]
  );

  const librosMenosPrestados = useMemo(
    () => [...datosEstadisticas.libros].sort((a, b) => a.prestamos - b.prestamos).slice(0, 10),
    [datosEstadisticas.libros]
  );

  const metricasActuales = datosEstadisticas.metricas[filtroGlobal];
  const tendenciaActual = datosEstadisticas.tendencias[filtroGlobal];

  const costoTotalLibros = datosEstadisticas.libros.reduce(
    (total, libro) => total + libro.precio * libro.ejemplares.length,
    0
  );

  const totalEjemplares = datosEstadisticas.libros.reduce(
    (total, libro) => total + libro.ejemplares.length,
    0
  );

  const getLibrosPorCategoria = (id) =>
    datosEstadisticas.categorias.find((c) => c._id === id)?.libros || [];

  return (
    <div className={global.backgroundWrapper}>
      <AppHeader onHomeClick={volverMenu} onLogoutClick={handleLogout} />

      {/* Título principal de la página */}
      <PageTitle
        title="Estadísticas"
        imageSrc="/images/complemento-1.png"
      />

      {/* Filtros globales */}
      <GlobalFilter filtroGlobal={filtroGlobal} setFiltroGlobal={setFiltroGlobal} />

      {/* Métricas */}
      <MetricCards metricasActuales={metricasActuales} />

      {/* Secciones */}
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <BarChart
              filtroGlobal={filtroGlobal}
              tendenciaActual={tendenciaActual}
              metricasActuales={metricasActuales}
            />
          </div>

          <div className="col-12 col-lg-5">
            <TopLibrosList
              vistaLibros={vistaLibros}
              setVistaLibros={setVistaLibros}
              librosMasPrestados={librosMasPrestados}
              librosMenosPrestados={librosMenosPrestados}
            />
          </div>

          <div className="col-12 col-lg-6">
            <CategoriesChart
              categorias={datosEstadisticas.categorias}
              setCategoriaSeleccionada={setCategoriaSeleccionada}
            />
          </div>

          <div className="col-12 col-lg-6">
            <ResumenBiblioteca
              datosEstadisticas={datosEstadisticas}
              setMostrarDevolucionesAtrasadas={setMostrarDevolucionesAtrasadas}
              setMostrarLibrosReservados={setMostrarLibrosReservados}
              costoTotalLibros={costoTotalLibros}
              totalEjemplares={totalEjemplares}
            />
          </div>
        </div>
      </div>

      {/* Modales */}
      {categoriaSeleccionada && (
        <ModalCategoria
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
          getLibrosPorCategoria={getLibrosPorCategoria}
        />
      )}

      {mostrarDevolucionesAtrasadas && (
        <ModalDevoluciones
          datos={datosEstadisticas.devolucionesAtrasadas}
          setMostrarDevolucionesAtrasadas={setMostrarDevolucionesAtrasadas}
        />
      )}

      {mostrarLibrosReservados && (
        <ModalReservas
          datos={datosEstadisticas.librosReservados}
          setMostrarLibrosReservados={setMostrarLibrosReservados}
        />
      )}
    </div>
  );
}
