"use client";
import React, { useEffect, useState, useMemo } from "react";
import global from "@/styles/Global.module.css";

// UI Components
import { AppHeader, PageTitle } from "@/components/ui";
import {
  GlobalFilter,
  MetricCards,
  BarChart,
  TopLibrosList,
  CategoriesChart,
  ResumenBiblioteca,
  ModalCategoria,
  ModalDevoluciones,
  ModalReservas,
} from "@/components/ui/estadisticas";

// Services
import { EstadisticasService } from "@/services";



export default function EstadisticasPage() {
  const [vistaLibros, setVistaLibros] = useState("masPrestados");
  const [filtroGlobal, setFiltroGlobal] = useState("hoy");

  const [metricas, setMetricas] = useState({
    prestamosTotales: 0,
    prestamosActivos: 0,
    librosBiblioteca: 0,
  });

  const [tendencias, setTendencias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [libros, setLibros] = useState([]);

  // Estado para resumen de biblioteca
  const [resumenBiblioteca, setResumenBiblioteca] = useState({
    devolucionesAtrasadas: [],
    librosReservados: [],
    costoTotalLibros: 0,
    totalEjemplares: 0
  });

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [mostrarDevolucionesAtrasadas, setMostrarDevolucionesAtrasadas] =
    useState(false);
  const [mostrarLibrosReservados, setMostrarLibrosReservados] =
    useState(false);
    const categoriasUI = useMemo(() => {
  const coloresCategorias = [
    "#dc2626", "#f59e0b", "#000000", "#6b7280", "#059669", "#7c3aed",
    "#db2777", "#0891b2", "#ca8a04", "#16a34a", "#9333ea", "#e11d48",
    "#0f766e", "#4338ca", "#b45309", "#be185d", "#0d9488", "#1e40af",
  ];

  return categorias.map((cat, index) => ({
    _id: cat.categoriaId,
    nombre: cat.categoria,
    porcentaje: Math.round(cat.porcentaje),
    color: coloresCategorias[index % coloresCategorias.length],
    libros: [], // backend aún no los envía
  }));
}, [categorias]);

  // =========================
  // CARGA DE DATOS BACKEND (CORREGIDO)
  // =========================
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        // ✅ ENDPOINTS ESTABLES
        const [
          metricasData,
          tendenciasData,
          categoriasData,
          resumenData,
        ] = await Promise.all([
          EstadisticasService.getMetricas({ periodo: filtroGlobal }),
          EstadisticasService.getTendencias({ periodo: filtroGlobal }),
          EstadisticasService.getCategorias(),
          EstadisticasService.getResumenBiblioteca(),
        ]);

        // ⚠️ ENDPOINT INESTABLE (NO ROMPE LA VISTA)
        let topLibrosData = [];
        try {
          topLibrosData = await EstadisticasService.getTopLibros("desc", 10);
        } catch (error) {
          console.warn("Top libros no disponible (backend):", error.message);
        }

        // ✅ MAPEO CORRECTO SEGÚN BACKEND
        setMetricas({
          prestamosTotales: metricasData?.prestamosTotales ?? 0,
          prestamosActivos: metricasData?.prestamosActivos ?? 0,
          librosBiblioteca: metricasData?.librosTotales ?? 0,
        });

        setTendencias(Array.isArray(tendenciasData) ? tendenciasData : []);
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        setLibros(Array.isArray(topLibrosData) ? topLibrosData : []);

        // ✅ MAPEO RESUMEN BIBLIOTECA
        setResumenBiblioteca({
          devolucionesAtrasadas: resumenData?.devolucionesAtrasadas ?? [],
          librosReservados: resumenData?.librosReservados ?? [],
          costoTotalLibros: resumenData?.costoTotalLibros ?? 0,
          totalEjemplares: resumenData?.totalEjemplares ?? 0
        });
      } catch (error) {
        console.error("Error crítico cargando estadísticas:", error);
      }
    };

    cargarEstadisticas();
  }, [filtroGlobal]);

  // =========================
  // DERIVADOS
  // =========================
  const librosMasPrestados = useMemo(() => {
    if (!Array.isArray(libros)) return [];
    return [...libros]
      .sort((a, b) => (b.prestamos ?? 0) - (a.prestamos ?? 0))
      .slice(0, 10);
  }, [libros]);

  const librosMenosPrestados = useMemo(() => {
    if (!Array.isArray(libros)) return [];
    return [...libros]
      .sort((a, b) => (a.prestamos ?? 0) - (b.prestamos ?? 0))
      .slice(0, 10);
  }, [libros]);

 const getLibrosPorCategoria = (categoriaId) => {
  console.log("CATEGORIA ID:", categoriaId);
  console.log("LIBROS:", libros);

  return libros.filter(
    
    (libro) =>
      libro.categoriaId === categoriaId ||
      libro.categoria?._id === categoriaId
  );
};

  // =========================
  // RENDER
  // =========================
  return (
    <div className={global.backgroundWrapper}>
      <AppHeader />

      <PageTitle title="Estadísticas" imageSrc="/images/complemento-1.png" />
console.log(librosPorCategoria[0])

      <GlobalFilter
        filtroGlobal={filtroGlobal}
        setFiltroGlobal={setFiltroGlobal}
      />

      <MetricCards metricasActuales={metricas} />

      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <BarChart
              filtroGlobal={filtroGlobal}
              tendenciaActual={tendencias}
              metricasActuales={metricas}
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
              categorias={categorias}
              setCategoriaSeleccionada={setCategoriaSeleccionada}
            />
          </div>

          <div className="col-12 col-lg-6">
            <ResumenBiblioteca
              datosEstadisticas={resumenBiblioteca}
              setMostrarDevolucionesAtrasadas={
                setMostrarDevolucionesAtrasadas
              }
              setMostrarLibrosReservados={setMostrarLibrosReservados}
              costoTotalLibros={resumenBiblioteca.costoTotalLibros}
              totalEjemplares={resumenBiblioteca.totalEjemplares}
            />
          </div>
        </div>
      </div>

      {categoriaSeleccionada && (
        <ModalCategoria
          categoriaSeleccionada={categoriaSeleccionada}
          setCategoriaSeleccionada={setCategoriaSeleccionada}
          getLibrosPorCategoria={getLibrosPorCategoria}
        />
      )}

      {mostrarDevolucionesAtrasadas && (
        <ModalDevoluciones
          datos={resumenBiblioteca.devolucionesAtrasadas}
          setMostrarDevolucionesAtrasadas={
            setMostrarDevolucionesAtrasadas
          }
        />
      )}

      {mostrarLibrosReservados && (
        <ModalReservas
          datos={resumenBiblioteca.librosReservados}
          setMostrarLibrosReservados={setMostrarLibrosReservados}
        />
      )}
    </div>
  );
}
