"use client";
import { useState } from "react";
import LoginForm from '../components/forms/LoginForm';
import MenuForm from '@/components/forms/MenuForm';
import PrestamoVista from '@/components/forms/PrestamoVista';
import Catalogo from '@/components/forms/Catalogo';
import EditarLibro from '@/components/forms/EditarLibro';

export default function HomePage() {
   const [vista, setVista] = useState("menu");

    return (
    <>
      {vista === "menu" && (
        <MenuForm 
          irPrestamos={() => setVista("prestamos")} 
          irCatalogo={() => setVista("catalogo")}
          irLogin={() => setVista("login")}
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
    </>
  );
}
