'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    // Redirigir si no está autenticado
    if (!user) {
      setIsRedirecting(true);
      router.push('/login');
      return;
    }

    // Verificar que el usuario tenga rol de admin o bibliotecario
    const rolesPermitidos = ['admin', 'bibliotecario', 'administrador'];
    if (!rolesPermitidos.includes(user.rol)) {
      console.log('Dashboard - Usuario sin permisos, redirigiendo a estudiante');
      setIsRedirecting(true);
      router.push('/estudiante');
      return;
    }
  }, [user, loading, router]);

  // Mostrar loading mientras verifica autenticación o está redirigiendo
  if (loading || isRedirecting) {
    return <LoadingSpinner message="Verificando autenticación..." />;
  }

  // Verificar rol antes de mostrar contenido
  const rolesPermitidos = ['admin', 'bibliotecario', 'administrador'];
  if (user && rolesPermitidos.includes(user.rol)) {
    return <>{children}</>;
  }

  return <LoadingSpinner message="Verificando permisos..." />;
}