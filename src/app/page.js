"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LoginForm from '../components/forms/LoginForm';
import MenuForm from '@/components/forms/MenuForm';
import PrestamoVista from '@/components/forms/PrestamoVista';
import Catalogo from '@/components/forms/Catalogo';
import EditarLibro from '@/components/forms/EditarLibro';
import Estadisticas from '@/components/forms/Estadisticas';
import Usuarios from '@/components/forms/Usuarios';

export default function HomePage() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [vista, setVista] = useState("login");

  // Actualizar vista basada en el estado de autenticación
  useEffect(() => {
    if (!loading) {
      const authenticated = isAuthenticated();
      if (authenticated && vista === "login") {
        // Solo cambiar al menú si estamos en login y nos autenticamos
        setVista("menu");
      } else if (!authenticated && vista !== "login") {
        // Solo cambiar a login si no estamos autenticados y no estamos ya en login
        setVista("login");
      }
    }
  }, [isAuthenticated, loading, vista]);

  // Función para manejar login exitoso - estabilizada con useCallback
  const handleLoginExitoso = useCallback(() => {
    // Solo forzar cambio de vista si no está autenticado
    // El useEffect se encargará del resto
    if (!isAuthenticated()) {
      setVista("menu");
    }
  }, [isAuthenticated]);

  // Función para manejar logout - estabilizada con useCallback
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setVista("login");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar vista de login aunque haya error
      setVista("login");
    }
  }, [logout]);

  // Funciones de navegación estabilizadas
  const irPrestamos = useCallback(() => setVista("prestamos"), []);
  const irCatalogo = useCallback(() => setVista("catalogo"), []);
  const irEstadisticas = useCallback(() => setVista("estadisticas"), []);
  const irUsuarios = useCallback(() => setVista("usuarios"), []);
  const volverMenu = useCallback(() => setVista("menu"), []);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <LoadingSpinner message="Verificando sesión..." />;
  }

  return (
    <>
      {vista === "login" && (
        <LoginForm loginExitoso={handleLoginExitoso} />
      )}
      {vista === "menu" && (
        <MenuForm 
          irPrestamos={irPrestamos}
          irCatalogo={irCatalogo}
          irEstadisticas={irEstadisticas} 
          irLogin={handleLogout}
          irUsuarios={irUsuarios}
        />
      )}
      {vista === "prestamos" && (
        <PrestamoVista volverMenu={volverMenu} />
      )}
      {vista === "catalogo" && (
        <Catalogo volverMenu={volverMenu} />
      )}
      {vista === "estadisticas" && (
        <Estadisticas volverMenu={volverMenu} />
      )}
      {vista === "usuarios" && (
        <Usuarios volverMenu={volverMenu} />
      )}
    </>
  );
}
