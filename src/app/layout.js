import { Inter } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Providers from './providers'; 
import Footer from '@/components/Footer'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Biblioteca Arrupe',
  description: 'Sistema de gestión bibliotecaria',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
           <Footer />
        </Providers>
      </body>
    </html>
  );
}