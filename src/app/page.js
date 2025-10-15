"use client";
import { useState } from "react";
import LoginForm from '../components/forms/LoginForm';
import MenuForm from '@/components/forms/MenuForm';
import PrestamoVista from '@/components/forms/PrestamoVista';
import Catalogo from '@/components/forms/Catalogo';
import EditarLibro from '@/components/forms/EditarLibro';
import Estadisticas from '@/components/forms/Estadisticas';
import Usuarios from '@/components/forms/Usuarios';

export default function HomePage() {
   const [vista, setVista] = useState("menu");

    return (
    <>
      {vista === "menu" && (
        <MenuForm 
          irPrestamos={() => setVista("prestamos")} 
          irCatalogo={() => setVista("catalogo")}
          irEstadisticas={() => setVista("estadisticas")} 
          irLogin={() => setVista("login")}
          irUsuarios={() => setVista("usuarios")} // Nueva vista de Usuarios
        />
      )}
      {vista === "prestamos" && (
        <PrestamoVista volverMenu={() => setVista("menu")} />
      )}
      {vista === "login" && (
        <LoginForm loginExitoso={() => setVista("menu")} />
      )}
      {vista === "catalogo" && (
        <Catalogo volverMenu={() => setVista("menu")} />
      )}
       {vista === "estadisticas" && ( // Nueva vista
        <Estadisticas volverMenu={() => setVista("menu")} />
      )}
      {vista === "usuarios" && (
        <Usuarios volverMenu={() => setVista("menu")} /> // Vista de Usuarios
      )}

    </>
  );
}
