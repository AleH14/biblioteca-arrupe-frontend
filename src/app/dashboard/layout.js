'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirigir si no está autenticado
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Mostrar loading mientras verifica autenticación
  if (status === 'loading') {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Si está autenticado, mostrar el contenido
  if (status === 'authenticated') {
    return <>{children}</>;
  }

  return null;
}