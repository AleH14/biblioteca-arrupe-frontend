import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "../../../styles/PrestamoVista.module.css";

const BusquedaLibroInput = ({ onLibroSeleccionado, onEjemplarSeleccionado, buscarLibros, hasError }) => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState("");
  const inputRef = useRef(null);
  const resultadosRef = useRef(null);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultadosRef.current &&
        !resultadosRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Búsqueda de libros con debounce
  useEffect(() => {
    if (!query || query.length < 2) {
      setResultados([]);
      setMostrarResultados(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setCargando(true);
      try {
        const response = await buscarLibros(query);
        if (response.success && response.data) {
          setResultados(response.data);
          setMostrarResultados(true);
        }
      } catch (error) {
        console.error("Error al buscar libros:", error);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, buscarLibros]);

  const handleQueryChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    if (libroSeleccionado) {
      setLibroSeleccionado(null);
      setEjemplarSeleccionado("");
      onLibroSeleccionado(null);
      onEjemplarSeleccionado(null);
    }
  }, [libroSeleccionado, onLibroSeleccionado, onEjemplarSeleccionado]);

  const handleSeleccionarLibro = useCallback((libro) => {
    setLibroSeleccionado(libro);
    setQuery(libro.titulo);
    setMostrarResultados(false);
    onLibroSeleccionado(libro);
    
    // El backend ya devuelve solo los ejemplares disponibles en "ejemplaresDisponibles"
    const ejemplaresDisponibles = libro.ejemplaresDisponibles || [];
    if (ejemplaresDisponibles.length === 1) {
      const ejemplar = ejemplaresDisponibles[0];
      setEjemplarSeleccionado(ejemplar.cdu);
      onEjemplarSeleccionado(ejemplar);
    }
  }, [onLibroSeleccionado, onEjemplarSeleccionado]);

  const handleSeleccionarEjemplar = useCallback((e) => {
    const cdu = e.target.value;
    setEjemplarSeleccionado(cdu);
    
    if (libroSeleccionado && cdu) {
      // Buscar en ejemplaresDisponibles que es lo que devuelve el backend
      const ejemplaresDisponibles = libroSeleccionado.ejemplaresDisponibles || [];
      const ejemplar = ejemplaresDisponibles.find((ej) => ej.cdu === cdu);
      onEjemplarSeleccionado(ejemplar);
    } else {
      onEjemplarSeleccionado(null);
    }
  }, [libroSeleccionado, onEjemplarSeleccionado]);

  const limpiarSeleccion = useCallback(() => {
    setQuery("");
    setLibroSeleccionado(null);
    setEjemplarSeleccionado("");
    setResultados([]);
    setMostrarResultados(false);
    onLibroSeleccionado(null);
    onEjemplarSeleccionado(null);
  }, [onLibroSeleccionado, onEjemplarSeleccionado]);

  // Obtener ejemplares disponibles del libro seleccionado
  const ejemplaresDisponibles = libroSeleccionado?.ejemplaresDisponibles || [];

  return (
    <div className={styles.busquedaLibroContainer}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleQueryChange}
          className={`form-control ${hasError ? "is-invalid" : ""}`}
          placeholder="Buscar libro por nombre, autor o CDU..."
          disabled={libroSeleccionado !== null}
        />
        {libroSeleccionado && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={limpiarSeleccion}
            title="Limpiar selección"
          >
            ×
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {mostrarResultados && !libroSeleccionado && (
        <div ref={resultadosRef} className={styles.resultadosBusqueda}>
          {cargando && (
            <div className={styles.resultadoItem}>
              <small className="text-muted">Buscando...</small>
            </div>
          )}
          
          {!cargando && resultados.length === 0 && (
            <div className={styles.resultadoItem}>
              <small className="text-muted">No se encontraron libros</small>
            </div>
          )}

          {!cargando && resultados.map((libro) => {
            // El backend ya devuelve los ejemplares disponibles
            const ejemplaresDisp = libro.ejemplaresDisponibles?.length || 0;

            return (
              <div
                key={libro.id || libro._id}
                className={styles.resultadoItem}
                onClick={() => handleSeleccionarLibro(libro)}
              >
                <div className={styles.resultadoTitulo}>{libro.titulo}</div>
                <div className={styles.resultadoInfo}>
                  <small className="text-muted">
                    {libro.autor} • {ejemplaresDisp} disponible(s)
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selección de ejemplar (CDU) */}
      {libroSeleccionado && ejemplaresDisponibles.length > 0 && (
        <div className="mt-3">
          <label className="form-label">
            Seleccionar Ejemplar (CDU)
            <span className="text-danger"> *</span>
          </label>
          <select
            value={ejemplarSeleccionado}
            onChange={handleSeleccionarEjemplar}
            className={`form-select ${hasError ? "is-invalid" : ""}`}
          >
            <option value="">Seleccione un ejemplar...</option>
            {ejemplaresDisponibles.map((ejemplar) => (
              <option key={ejemplar.id || ejemplar._id} value={ejemplar.cdu}>
                {ejemplar.cdu}
                {ejemplar.ubicacionFisica ? ` - ${ejemplar.ubicacionFisica}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {libroSeleccionado && ejemplaresDisponibles.length === 0 && (
        <div className="alert alert-warning mt-3" role="alert">
          <small>Este libro no tiene ejemplares disponibles.</small>
        </div>
      )}
    </div>
  );
};

export default BusquedaLibroInput;
