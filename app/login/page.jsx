'use client'

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.css';
import AuthContext from '../../context/AuthContext'; 

const Login = () => {
  const { handleLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        await handleLogin();
        toast.success('Inicio de sesión exitoso');
        router.push('/products');
      } else {
        setError('Usuario o contraseña no válidos');
        toast.error('Usuario o contraseña no válidos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtelo nuevamente.');
      toast.error('Error al iniciar sesión. Inténtelo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login</h2>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;