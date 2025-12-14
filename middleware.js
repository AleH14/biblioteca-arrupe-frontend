import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Obtener token de localStorage no funciona en middleware, 
  // así que verificaremos en el cliente
  // El middleware ahora solo maneja redirecciones básicas
  
  // Si está en login y ya tiene token, podría redirigir a dashboard
  // Pero esto se manejará mejor en el cliente
  
  return NextResponse.next();
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/libros/:path*',
    '/prestamos/:path*',
    '/usuarios/:path*',
    '/estudiante/:path*'
  ]
};