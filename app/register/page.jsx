"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
});
const [error, setError] = useState(null);
const router = useRouter();

const handleChange = (e) => {
    setFormData({
    ...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
const response = await fetch('http://localhost:8000/api/register', {
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
    router.push('/login');
    toast.success('Registro exitoso. Por favor, inicie sesión.');
} else {
    console.error('Error al registrar:', data.message);
    setError(data.message);
    toast.error(data.message || 'Error al registrar');
}
} catch (error) {
    console.error('Error al registrar:', error.message);
    setError('Error al registrar. Inténtelo nuevamente.');
    toast.error('Error al registrar. Inténtelo nuevamente.');
}
};

return (
<div className={styles.container}>
<div className={styles.card}>
    <h2>Registro</h2>
    <form onSubmit={handleSubmit}>
<div>
<label>Nombre:</label>
    <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    required/>
</div>
<div>
<label>Email:</label>
    <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required/>
</div>
<div>
<label>Contraseña:</label>
    <input
    type="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    required/>
</div>
<div>
<label>Dirección:</label>
    <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    required/>
</div>
    <button type="submit">Registrarse</button>
</form>
    {error && <p className={styles.error}>{error}</p>}
</div>
</div>
);
};

export default Register;