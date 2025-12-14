'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Verificar si hay sesión guardada al montar el componente
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        console.log('AuthContext - initAuth:', { token: !!token, userData: !!userData });

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext - Setting user from localStorage:', parsedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        console.log('AuthContext - Setting loading to false');
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Efecto adicional para recargar usuario si no está presente pero hay datos en localStorage
  useEffect(() => {
    if (initialized && !user && !loading) {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        console.log('AuthContext - Reloading user from localStorage');
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, [initialized, user, loading]);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Attempting login for:', credentials.email);
      
      const result = await authService.login(credentials);

      console.log('AuthContext: Login result:', result);

      if (result.success) {
        console.log('AuthContext: Login successful', result.user);
        setUser(result.user);
        return {
          success: true,
          message: 'Login exitoso',
          user: result.user // Devolver el usuario en el resultado
        };
      }

      return {
        success: false,
        error: result.error || 'Error al iniciar sesión'
      };
    } catch (error) {
      console.error('AuthContext: Login exception:', error);
      return {
        success: false,
        error: 'Error al iniciar sesión'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      return {
        success: true,
        message: 'Sesión cerrada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    return user?.rol === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.rol);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};