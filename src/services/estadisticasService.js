// src/services/estadisticasService.js

import apiClient from "./api";

const ESTADISTICAS_API_URL = "/api/estadisticas";

export const getMetricas = async (params = {}) => {
  const response = await apiClient.get(`${ESTADISTICAS_API_URL}/metricas`, {
    params: {
      periodo: params.periodo ?? "mensual",
    },
  });

  return response.data.data;
};

export const getCategorias = async () => {
  const response = await apiClient.get(
    `${ESTADISTICAS_API_URL}/categorias`
  );

  // 🔥 AQUÍ ESTABA EL PROBLEMA
  return response.data.data.porcentajeCategorias ?? [];
};

export const getTendencias = async (params = {}) => {
  const response = await apiClient.get(
    `${ESTADISTICAS_API_URL}/tendencias`,
    {
      params: {
        periodo: params.periodo ?? "mensual",
      },
    }
  );

  return response.data.data;
};

export const getTopLibros = async (orden = "desc", limite = 5) => {
  const response = await apiClient.get(
    `${ESTADISTICAS_API_URL}/libros/top`,
    {
      params: { orden, limite },
    }
  );

  return response.data.data;
};

export const getEstadisticasLibro = async (libroId) => {
  const response = await apiClient.get(
    `${ESTADISTICAS_API_URL}/libro`,
    {
      params: { id: libroId },
    }
  );

  return response.data.data;
};

export const getResumenBiblioteca = async () => {
  const response = await apiClient.get(
    `${ESTADISTICAS_API_URL}/resumen`
  );

  return response.data.data;
};
