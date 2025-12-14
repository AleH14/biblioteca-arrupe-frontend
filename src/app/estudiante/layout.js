'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AppHeaderEstudiante from '@/components/ui/intestudiantes/AppHeaderEstudiante';
import PageTitle from '@/components/ui/PageTitle';
import Menu from '@/components/ui/intestudiantes/MenuEstudiante';
import global from '@/styles/Global.module.css';

export default function EstudianteLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Verificar autenticación y rol
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      setIsRedirecting(true);
      router.push('/login');
      return;
    }

    // Verificar que el usuario tenga rol de estudiante
    if (user.rol !== 'estudiante') {
      console.log('Estudiante - Usuario no es estudiante, redirigiendo a dashboard');
      setIsRedirecting(true);
      router.push('/dashboard');
      return;
    }
  }, [loading, user, router]);

  // Si está cargando, redirigiendo o no autenticado
  if (loading || isRedirecting || !user) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Verificar rol antes de mostrar contenido
  if (user.rol !== 'estudiante') {
    return <LoadingSpinner message="Verificando permisos..." />;
  }

  return (
    <div className={global.backgroundWrapper}>
      <AppHeaderEstudiante />
      <PageTitle title="Biblioteca Padre Arrupe" />
      
      {/* El menú se moverá a cada página individual si es necesario */}
      {/* O puedes ponerlo aquí si siempre es el mismo para todas las páginas */}
      
      <main className="container py-4">
        {children}
      </main>
    </div>
  );
}