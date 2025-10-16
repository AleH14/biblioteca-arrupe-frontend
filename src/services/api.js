import axios from 'axios';

// Configuración base para las llamadas al backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - agregar token de autorización si existe
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage si existe
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Opcional: redirigir al login
        // window.location.href = '/login';
      }
    }
    
    // Manejar otros errores
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };