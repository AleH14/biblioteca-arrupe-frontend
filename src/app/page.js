"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import dynamic from "next/dynamic"; // para carga dinámica y control de carga

// Importación diferida (lazy loading) de vistas
const LoginForm = dynamic(() => import('../components/forms/LoginForm'));
const MenuForm = dynamic(() => import('@/components/forms/MenuForm'));
const PrestamoVista = dynamic(() => import('@/components/forms/PrestamoVista'));
const Catalogo = dynamic(() => import('@/components/forms/Catalogo'));
const EditarLibro = dynamic(() => import('@/components/forms/EditarLibro'));
const Estadisticas = dynamic(() => import('@/components/forms/Estadisticas'));
const Usuarios = dynamic(() => import('@/components/forms/Usuarios'));
const InterfazEstudiantes = dynamic(() => import('@/components/forms/InterfazEstudiantes'));

export default function HomePage() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [vista, setVista] = useState("login");
  const [esperandoRol, setEsperandoRol] = useState(false);
  const [componentesCargados, setComponentesCargados] = useState(false);

  // Determinar vista inicial según rol
  const determinarVistaInicial = useCallback(() => {
    if (!user || !user.role) {
      return null;
    }
    switch(user.role.toLowerCase()) {
      case 'estudiante':
        return "estudiante-catalogo";
      case 'admin':
      case 'administrador':
        return "menu";
      default:
        return "menu";
    }
  }, [user]);

  // Efecto principal
  useEffect(() => {
    if (!loading) {
      const authenticated = isAuthenticated();
      if (authenticated && vista === "login") {
        if (user && user.role) {
          const vistaInicial = determinarVistaInicial();
          setVista(vistaInicial);
          setEsperandoRol(false);
        } else {
          setEsperandoRol(true);
        }
      } else if (!authenticated && vista !== "login") {
        setVista("login");
        setEsperandoRol(false);
        setComponentesCargados(false);
      }
    }
  }, [isAuthenticated, loading, vista, user, determinarVistaInicial]);

  // Esperar al rol
  useEffect(() => {
    if (esperandoRol && user && user.role) {
      const vistaInicial = determinarVistaInicial();
      setVista(vistaInicial);
      setEsperandoRol(false);
    }
  }, [esperandoRol, user, determinarVistaInicial]);

  // Control de carga de componentes (solo tras login)
  useEffect(() => {
    if (vista !== "login") {
      setComponentesCargados(false);
      const timer = setTimeout(() => setComponentesCargados(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [vista]);

  // Manejar login
  const handleLoginExitoso = useCallback(() => {}, []);

  // Logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setVista("login");
      setComponentesCargados(false);
    } catch (error) {
      setVista("login");
      setComponentesCargados(false);
    }
  }, [logout]);

  // Navegación entre vistas
  const irPrestamos = useCallback(() => setVista("prestamos"), []);
  const irCatalogo = useCallback(() => setVista("catalogo"), []);
  const irEstadisticas = useCallback(() => setVista("estadisticas"), []);
  const irUsuarios = useCallback(() => setVista("usuarios"), []);
  const volverMenu = useCallback(() => {
    const vistaInicial = determinarVistaInicial();
    setVista(vistaInicial);
  }, [determinarVistaInicial]);

  // Mostrar spinner mientras carga autenticación o rol
  if (loading || esperandoRol) {
    return <LoadingSpinner message="Biblioteca Padre Arrupe" />;
  }

  // Mostrar spinner tras login mientras los componentes cargan
 /* if (vista !== "login" && !componentesCargados) {
    return <LoadingSpinner message="Cargando..." />;
  }*/

  //Renderizado principal con Suspense (por si Next.js tarda en montar)
  return (
    <Suspense fallback={<LoadingSpinner message="Cargando..." />}>
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
      {vista === "estudiante-catalogo" && (
        <InterfazEstudiantes volverMenu={volverMenu} />
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
    </Suspense>
  );
}
