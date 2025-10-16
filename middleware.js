import { withAuth } from 'next-auth/middleware';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any additional middleware logic here
    console.log('Middleware executed for:', req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user has token (is authenticated)
        if (!token) {
          return false;
        }

        // Check for admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token.role === 'admin';
        }

        // For other protected routes, just require authentication
        return true;
      },
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/libros/:path*',
    '/prestamos/:path*',
    '/usuarios/:path*',
    '/api/protected/:path*'
  ]
};