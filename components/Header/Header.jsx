"use client";

import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt, faList, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.css';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const { isLoggedIn, user, handleLogout } = useContext(AuthContext);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);
    console.log('user:', user);
  }, [isLoggedIn, user]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await handleLogout();
      router.push('/login');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión. Por favor, inténtelo de nuevo.');
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.mainNav}>
      <button className={styles.menuToggle} onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>
      <ul className={`${styles.mainMenu} ${menuOpen ? styles.open : ''} ${isLoggedIn ? styles.loggedIn : ''}`}>
        {isLoggedIn ? (
          <>
            <li className={styles.mainMenuItem}>
              <span className={styles.welcomeMessage}>Bienvenido {user?.name}</span>
            </li>
            <li className={styles.mainMenuItem}>
              <Link href="/products" className={styles.mainMenuLink}>
                <FontAwesomeIcon icon={faList} /> Productos
              </Link>
            </li>
            <li className={styles.mainMenuItem}>
              <Link href="/cart" className={styles.mainMenuLink}>
                <FontAwesomeIcon icon={faShoppingCart} /> Carrito
              </Link>
            </li>
            <li className={styles.mainMenuItem}>
              <Link href="/profile" className={styles.mainMenuLink}>
                <FontAwesomeIcon icon={faUser} /> Mi perfil
              </Link>
            </li>
            <li className={styles.mainMenuItem}>
              <button className={styles.logoutButton} onClick={logout} disabled={loggingOut}>
                {loggingOut ? 'Cerrando sesión...' : <><FontAwesomeIcon icon={faSignOutAlt} /> Logout</>}
              </button>
            </li>
          </>
        ) : (
          <>
            <li className={styles.mainMenuItem}>
              <Link href="/register" className={styles.mainMenuLink}>
                Register
              </Link>
            </li>
            <li className={styles.mainMenuItem}>
              <Link href="/login" className={styles.mainMenuLink}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
