import axios from 'axios';

// Cliente axios específico para NextAuth sin interceptors
const authApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Función de login específica para NextAuth
 * Esta función no interactúa con localStorage para evitar problemas en server-side
 */
export const loginForNextAuth = async (credentials) => {
  try {
    console.log('NextAuth login attempt:', { 
      email: credentials.email,
      apiUrl: process.env.NEXT_PUBLIC_API_URL 
    });
    
    const response = await authApiClient.post('/api/auth/login', credentials);
    
    console.log('NextAuth login response:', response.status, response.data);
    
    const { token, user } = response.data;
    
    if (!token || !user) {
      console.error('NextAuth: Missing token or user in response');
      return {
        success: false,
        error: 'Respuesta inválida del servidor'
      };
    }
    
    return {
      success: true,
      token,
      user,
      message: 'Login exitoso'
    };
  } catch (error) {
    console.error('NextAuth login error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      url: error.config?.url
    });
    
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'No se puede conectar al servidor backend';
    } else if (error.response?.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    return {
      success: false,
      error: errorMessage,
      status: error.response?.status
    };
  }
};