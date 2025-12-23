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
  withCredentials: true, // Importante: permite enviar/recibir cookies httpOnly
});

// Variable para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

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

// Interceptor para responses - manejar errores y refresh automático
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 y no es el endpoint de login o refresh
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/login') &&
      !originalRequest.url?.includes('/api/auth/refreshToken')
    ) {
      // Si ya está refrescando, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token
        const response = await apiClient.post('/api/auth/refreshToken', {});
        
        const { data } = response.data;
        const newToken = data.accessToken;
        
        if (typeof window !== 'undefined' && newToken) {
          localStorage.setItem('authToken', newToken);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        // Actualizar el header del request original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Procesar cola de requests fallidos
        processQueue(null, newToken);
        
        // Reintentar el request original
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, limpiar y redirigir al login
        processQueue(refreshError, null);
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Manejar otros errores
    // Suprimir logs para errores esperados (400 en categorías)
    if (error.config?.url?.includes('/categorias/') && error.response?.status === 400) {
      // Error esperado cuando categoría tiene libros asociados
      // No hacer nada adicional, solo rechazar silenciosamente
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };