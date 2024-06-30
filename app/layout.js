import '../styles/globals.css';
import Header from '../components/Header/Header';
import '../app/fontawesome';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'TelaShop',
  description: 'Tienda online de venta de telas, con opción de pago con MercadoPago',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
