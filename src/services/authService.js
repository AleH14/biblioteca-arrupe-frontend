import apiClient from './api';

/**
 * Servicio de autenticación
 * Maneja todas las operaciones relacionadas con autenticación
 */

/**
 * Realiza el login del usuario
 * @param {Object} credentials - Credenciales del usuario
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Respuesta del servidor con token y datos del usuario
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    
    // El backend devuelve { success: true, data: { accessToken, user }, mensaje }
    const { data } = response.data;
    const { accessToken, user } = data;
    
    // Guardar token en localStorage
    if (typeof window !== 'undefined' && accessToken) {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('userData', JSON.stringify(user));
    }
    
    return {
      success: true,
      token: accessToken,
      user: user,
      message: 'Login exitoso'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Error al iniciar sesión';
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status
    };
  }
};

/**
 * Refresca el access token usando el refresh token (cookie httpOnly)
 * @returns {Promise<Object>} Nuevo access token y datos del usuario
 */
export const refreshToken = async () => {
  try {
    console.log('authService - Intentando refrescar token...');
    const response = await apiClient.post('/api/auth/refreshToken', {});
    
    const { data } = response.data;
    const { accessToken, user } = data;
    
    if (!accessToken || !user) {
      console.error('authService - Respuesta inválida del servidor:', { hasToken: !!accessToken, hasUser: !!user });
      return {
        success: false,
        error: 'Respuesta inválida del servidor'
      };
    }
    
    // Guardar nuevo token en localStorage
    if (typeof window !== 'undefined' && accessToken) {
      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('userData', JSON.stringify(user));
      console.log('authService - Token actualizado en localStorage');
    }
    
    return {
      success: true,
      token: accessToken,
      user: user,
      message: 'Token refrescado'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Error al refrescar token';
    
    const errorStatus = error.response?.status;
    
    console.error('authService - Error al refrescar token:', {
      message: errorMessage,
      status: errorStatus,
      hasRefreshCookie: document.cookie.includes('refreshToken')
    });
    
    // Si es error 401, significa que el refresh token expiró o no es válido
    if (errorStatus === 401) {
      console.warn('authService - Refresh token expirado o inválido. Se requiere login.');
    }
    
    return {
      success: false,
      error: errorMessage,
      status: errorStatus
    };
  }
};

/**
 * Cierra la sesión del usuario
 * @returns {Promise<Object>} Confirmación de logout
 */
export const logout = async () => {
  try {
    // Llamar endpoint de logout en el backend para revocar refresh token
    await apiClient.post('/api/auth/logout');
    
    // Limpiar datos locales
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
  } catch (error) {
    // Aunque falle la llamada al backend, limpiar datos locales
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    return {
      success: true,
      message: 'Sesión cerrada'
    };
  }
};

/**
 * Obtiene los datos del usuario actual
 * @returns {Object|null} Datos del usuario o null si no está autenticado
 */
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('authToken');
    
    if (userData && token) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      }
    }
  }
  return null;
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} True si está autenticado, false si no
 */
export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  return false;
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token de autenticación o null
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Verifica el estado de la sesión con el backend
 * @returns {Promise<Object>} Estado de la sesión
 */
export const verifySession = async () => {
  try {
    const response = await apiClient.get('/api/auth/verify');
    return {
      success: true,
      valid: true,
      user: response.data.user
    };
  } catch (error) {
    // Si el token es inválido, limpiar datos locales
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    return {
      success: false,
      valid: false,
      error: error.response?.data?.message || 'Token inválido'
    };
  }
};

// Exportación por defecto del objeto con todos los métodos
const authService = {
  login,
  refreshToken,
  logout,
  getCurrentUser,
  isAuthenticated,
  getAuthToken,
  verifySession
};

export default authService;