import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Protección de rutas por rol
    const { pathname } = req.nextUrl;
    
    // Rutas de dashboard - solo para admin/bibliotecario/administrador
    if (pathname.startsWith('/dashboard')) {
      // Si es estudiante, redirigir a la interfaz de estudiante
      if (token?.role === 'estudiante') {
        const url = new URL('/estudiante', req.url);
        return NextResponse.redirect(url);
      }
      
      // Solo permitir si es admin, bibliotecario o administrador
      const rolesPermitidos = ['admin', 'bibliotecario', 'administrador'];
      if (!rolesPermitidos.includes(token?.role)) {
        // Si no tiene un rol válido, redirigir al login
        const url = new URL('/login', req.url);
        return NextResponse.redirect(url);
      }
    }
    
    // Rutas de estudiante - solo para estudiantes
    if (pathname.startsWith('/estudiante')) {
      // Si NO es estudiante, redirigir al login
      if (token?.role !== 'estudiante') {
        const url = new URL('/login', req.url);
        return NextResponse.redirect(url);
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rutas protegidas
        const protectedPaths = ['/dashboard', '/estudiante'];
        const currentPath = req.nextUrl.pathname;
        
        // Verificar si la ruta actual está protegida
        const isProtected = protectedPaths.some(path => 
          currentPath.startsWith(path)
        );
        
        // Si la ruta está protegida y no hay token, redirigir al login
        if (isProtected && !token) {
          const url = new URL('/login', req.url);
          return Response.redirect(url);
        }
        
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/estudiante/:path*'
  ]
};