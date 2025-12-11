'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AppHeaderEstudiante from '@/components/ui/intestudiantes/AppHeaderEstudiante';
import PageTitle from '@/components/ui/PageTitle';
import Menu from '@/components/ui/intestudiantes/MenuEstudiante';
import global from '@/styles/Global.module.css';

export default function EstudianteLayout({ children }) {
  const { user, status } = useAuth();
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated' || !user) {
      router.push('/login');
      return;
    }
  }, [status, user, router]);

  // Si está cargando o no autenticado
  if (status === 'loading' || !user) {
    return <LoadingSpinner />;
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