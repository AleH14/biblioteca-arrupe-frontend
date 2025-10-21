'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, [session, status]);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Attempting login for:', credentials.email);
      
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      console.log('AuthContext: signIn result:', result);

      if (result?.error) {
        // Solo mostrar en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.warn('AuthContext: Login failed -', result.error);
        }
        
        // Mapear diferentes tipos de errores de NextAuth
        let errorMessage = 'Error al iniciar sesión';
        
        switch (result.error) {
          case 'CredentialsSignin':
            errorMessage = 'Email o contraseña incorrectos';
            break;
          case 'AccessDenied':
            errorMessage = 'Acceso denegado';
            break;
          case 'Configuration':
            errorMessage = 'Error de configuración del servidor';
            break;
          default:
            errorMessage = 'Error al iniciar sesión';
        }
        
        return {
          success: false,
          error: errorMessage
        };
      }

      if (result?.ok) {
        console.log('AuthContext: Login successful');
        return {
          success: true,
          message: 'Login exitoso'
        };
      }

      return {
        success: false,
        error: 'Error desconocido al iniciar sesión'
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
      await signOut({ redirect: false });
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
    return !!session?.user;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    status
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};