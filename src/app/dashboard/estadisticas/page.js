"use client";

import React, { useState, useEffect, useMemo } from "react";
import global from "@/styles/Global.module.css";

// UI
import AppHeader from "@/components/ui/AppHeader";
import PageTitle from "@/components/ui/PageTitle";
import GlobalFilter from "@/components/ui/estadisticas/GlobalFilter";
import MetricCards from "@/components/ui/estadisticas/MetricCards";
import BarChart from "@/components/ui/estadisticas/BarChart";
import TopLibrosList from "@/components/ui/estadisticas/TopLibrosList";
import CategoriesChart from "@/components/ui/estadisticas/CategoriesChart";
import ResumenBiblioteca from "@/components/ui/estadisticas/ResumenBiblioteca";
import ModalCategoria from "@/components/ui/estadisticas/ModalCategoria";
import ModalDevoluciones from "@/components/ui/estadisticas/ModalDevoluciones";
import ModalReservas from "@/components/ui/estadisticas/ModalReservas";

// Services
import * as EstadisticasService from "@/services/estadisticasService";

export default function EstadisticasPage() {
  const [vistaLibros, setVistaLibros] = useState("masPrestados");
  const [filtroGlobal, setFiltroGlobal] = useState("hoy");

  const [metricas, setMetricas] = useState({
    prestamosTotales: 0,
    prestamosActivos: 0,
    librosBiblioteca: 0,
    reservasTotales: 0,
    reservasActivas: 0,
  });

  const [tendencias, setTendencias] = useState([]);
  const [datosCategorias, setDatosCategorias] = useState({
    totalLibrosPorCategoria: [],
    totalEjemplaresPorCategoria: [],
    totalPrestamosPorCategoria: [],
    porcentajeCategorias: []
  });
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

  // Preparar categorías para el gráfico
  const categoriasParaGrafico = useMemo(() => {
    const coloresCategorias = [
      "#6366f1", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
      "#db2777", "#0891b2", "#ca8a04", "#16a34a", "#9333ea", "#e11d48",
      "#0f766e", "#4338ca", "#b45309", "#be185d", "#0d9488", "#1e40af",
    ];

    return datosCategorias.porcentajeCategorias.map((cat, index) => ({
      categoriaId: cat.categoriaId,
      categoria: cat.categoria,
      porcentaje: cat.porcentaje,
      totalLibros: cat.totalLibros,
      color: coloresCategorias[index % coloresCategorias.length],
    }));
  }, [datosCategorias]);

  // Obtener libros por categoría
  const getLibrosPorCategoria = (categoriaId) => {
    if (!categoriaId || !datosCategorias.totalLibrosPorCategoria) return [];
    
    return datosCategorias.totalLibrosPorCategoria.filter(libro => {
      // Comparar con diferentes posibles estructuras del ID
      const libroCategoriaId = libro.categoriaId || 
                              libro.categoria?._id || 
                              libro.categoria;
      
      return String(libroCategoriaId) === String(categoriaId);
    });
  };

  // =========================
  // CARGA DE DATOS BACKEND
  // =========================
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        // Cargar datos principales
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

        // Intentar cargar top libros (endpoint inestable)
        let topLibrosData = [];
        try {
          topLibrosData = await EstadisticasService.getTopLibros("desc", 10);
        } catch (error) {
          console.warn("Top libros no disponible:", error.message);
        }

        // Procesar métricas
        setMetricas({
          prestamosTotales: metricasData?.prestamosTotales ?? 0,
          prestamosActivos: metricasData?.prestamosActivos ?? 0,
          librosBiblioteca: metricasData?.librosTotales ?? 0,
          reservasTotales: metricasData?.reservasTotales ?? 0,
          reservasActivas: metricasData?.reservasActivas ?? 0,
        });

        // Procesar tendencias
        setTendencias(Array.isArray(tendenciasData) ? tendenciasData : []);

        // Procesar categorías (estructura completa del backend)
        setDatosCategorias({
          totalLibrosPorCategoria: categoriasData?.totalLibrosPorCategoria || [],
          totalEjemplaresPorCategoria: categoriasData?.totalEjemplaresPorCategoria || [],
          totalPrestamosPorCategoria: categoriasData?.totalPrestamosPorCategoria || [],
          porcentajeCategorias: categoriasData?.porcentajeCategorias || []
        });

        // Procesar libros
        setLibros(Array.isArray(topLibrosData) ? topLibrosData : []);

        // Procesar resumen de biblioteca
        setResumenBiblioteca({
          devolucionesAtrasadas: resumenData?.devolucionesAtrasadas ?? [],
          librosReservados: resumenData?.librosReservados ?? [],
          costoTotalLibros: resumenData?.costoTotalLibros ?? 0,
          totalEjemplares: resumenData?.totalEjemplares ?? 0
        });

      } catch (error) {
        console.error("Error cargando estadísticas:", error);
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
      .sort((a, b) => (b.totalPrestamos ?? 0) - (a.totalPrestamos ?? 0))
      .slice(0, 10);
  }, [libros]);

  const librosMenosPrestados = useMemo(() => {
    if (!Array.isArray(libros)) return [];
    return [...libros]
      .sort((a, b) => (a.totalPrestamos ?? 0) - (b.totalPrestamos ?? 0))
      .slice(0, 10);
  }, [libros]);

  // =========================
  // RENDER
  // =========================
  return (
    <div className={global.backgroundWrapper}>
      <AppHeader />

      <PageTitle title="Estadísticas" imageSrc="/images/complemento-1.png" />

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
              categorias={categoriasParaGrafico}
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
          datosCategorias={datosCategorias}
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