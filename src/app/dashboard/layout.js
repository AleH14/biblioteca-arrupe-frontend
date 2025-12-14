'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Si está autenticado, mostrar el contenido
  if (user) {
    return <>{children}</>;
  }

  return null;
}