'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  const refreshTimerRef = useRef(null);

  // Función para programar refresh automático del token
  const scheduleTokenRefresh = () => {
    // Limpiar timer anterior si existe
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Programar refresh 1 minuto antes de que expire (14 minutos si expira en 15)
    const refreshTime = 14 * 60 * 1000; // 14 minutos en milisegundos
    
    console.log(`AuthContext - Refresh programado para ${refreshTime / 60000} minutos`);
    
    refreshTimerRef.current = setTimeout(async () => {
      console.log('AuthContext - Ejecutando refresh automático del token...');
      try {
        const result = await authService.refreshToken();
        if (result.success && result.user) {

           if (result.user.activo === false) {
            console.warn('AuthContext - Usuario desactivado durante refresh');
            handleLogout();
            window.location.href = '/login?disabled=true';
            return;
          }
          setUser(result.user);
          // Programar el siguiente refresh
          scheduleTokenRefresh();
        } else {
          console.warn('AuthContext - Refresh falló:', result.error || 'Sin mensaje de error');
          console.warn('AuthContext - La sesión expiró. Por favor, inicie sesión nuevamente.');
          handleLogout();
          // Redirigir al login si no estamos ya ahí
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
      } catch (error) {
        console.error('AuthContext - Error al refrescar token:', error.message);
        console.warn('AuthContext - Sesión expirada o cookie no válida');
        handleLogout();
        // Redirigir al login si no estamos ya ahí
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }, refreshTime);
  };

  // Función interna para manejar logout
  const handleLogout = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  };

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
          
          // Intentar validar que el refresh token todavía es válido
          try {
            const result = await authService.refreshToken();
            if (result.success) {
              console.log('AuthContext - Refresh token validado al iniciar');
              setUser(result.user);
              scheduleTokenRefresh();
            } else {
              console.warn('AuthContext - Refresh token no válido al iniciar, limpiando sesión');
              handleLogout();
            }
          } catch (error) {
            console.warn('AuthContext - Error validando refresh token al iniciar:', error.message);
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        handleLogout();
      } finally {
        console.log('AuthContext - Setting loading to false');
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();

    // Cleanup al desmontar
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Sincronizar sesión entre pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        // Si se borra el token en otra pestaña, cerrar sesión aquí también
        if (!e.newValue && e.key === 'authToken') {
          console.log('AuthContext - Token removed in another tab');
          handleLogout();
        }
        // Si se actualiza el usuario en otra pestaña, sincronizar
        else if (e.key === 'userData' && e.newValue) {
          try {
            const newUser = JSON.parse(e.newValue);
            console.log('AuthContext - User updated in another tab');
            setUser(newUser);
          } catch (error) {
            console.error('Error parsing user data from storage event:', error);
          }
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Efecto adicional para recargar usuario si no está presente pero hay datos en localStorage
  useEffect(() => {
    if (initialized && !user && !loading) {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        console.log('AuthContext - Reloading user from localStorage');
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          scheduleTokenRefresh();
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
        // Programar refresh automático del token
        scheduleTokenRefresh();
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
      handleLogout(); // Usar función interna que limpia el timer
      return {
        success: true,
        message: 'Sesión cerrada correctamente'
      };
    } catch (error) {
      handleLogout(); // Limpiar de todas formas
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  };

  const isAuthenticated = () => {
    return !!user  && user.activo === true;;
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