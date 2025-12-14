import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Obtener token de las cookies
  const token = req.cookies.get('authToken')?.value;
  
  // Si no hay token y está intentando acceder a rutas protegidas
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/estudiante'))) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }
  
  // Si hay token, permitir el acceso
  // La validación de roles se hará en el cliente con el AuthContext
  return NextResponse.next();
}

// Configuración de rutas protegidas
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/estudiante/:path*'
  ]
};

// Nota: La validación detallada de roles ahora se maneja en:
// 1. AuthContext para el estado global
// 2. Componentes individuales que verifican permisos
// 3. Backend que es la fuente de verdad
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