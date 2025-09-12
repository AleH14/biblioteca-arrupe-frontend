"use client";
import { useState } from "react";
import LoginForm from '../components/forms/LoginForm';
import MenuForm from '@/components/forms/MenuForm';
import PrestamoVista from '@/components/forms/PrestamoVista';

export default function HomePage() {
   const [vista, setVista] = useState("menu");

    return (
    <>
      {vista === "menu" && (
        <MenuForm irPrestamos={() => setVista("prestamos")} />
      )}
      {vista === "prestamos" && (
        <PrestamoVista volverMenu={() => setVista("menu")} />
      )}
    </>
  );
}
