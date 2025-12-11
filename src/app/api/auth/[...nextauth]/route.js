import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginForNextAuth } from '@/services/authNextAuth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'usuario@ejemplo.com' 
        },
        password: { 
          label: 'Contraseña', 
          type: 'password' 
        }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', { 
          email: credentials?.email,
          hasPassword: !!credentials?.password,
          apiUrl: process.env.NEXT_PUBLIC_API_URL
        });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials in authorize');
          return null;
        }

        try {
          const result = await loginForNextAuth({
            email: credentials.email,
            password: credentials.password
          });

          console.log('Login result in authorize:', { 
            success: result.success, 
            hasUser: !!result.user,
            error: result.error 
          });

          if (result.success && result.user) {
            // NextAuth espera un objeto user con al menos id, name, email
            const user = {
              id: result.user.id,
              name: result.user.nombre || result.user.name,
              email: result.user.email,
              role: result.user.rol || result.user.role,
              active: result.user.activo || result.user.active,
              token: result.token
            };
            console.log('Returning user from authorize:', user);
            return user;
          }

          console.log('Login failed in authorize:', result.error);
          return null;
        } catch (error) {
          console.error('Exception in authorize:', error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario se autentica por primera vez
      if (user) {
        console.log('JWT callback - user:', user);
        token.id = user.id;
        token.role = user.role;
        token.active = user.active;
        token.accessToken = user.token;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Enviar propiedades al cliente
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.active = token.active;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hora
  },
  
  jwt: {
    maxAge: 1 * 60 * 60, // 1 hora
  },
  
  debug: process.env.NODE_ENV === 'development',
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };