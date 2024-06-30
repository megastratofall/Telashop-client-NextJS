"use client"
import { createContext, useState, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);

useEffect(() => {
    checkLoginStatus();
}, []);

const checkLoginStatus = async () => {
try {
const token = localStorage.getItem('token');
if (token) {
const response = await fetch('http://localhost:8000/api/client/profile', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
},
});
if (response.ok) {
const data = await response.json();
    setUser(data);
    setIsLoggedIn(true);
} else {
throw new Error('Invalid token');
}
} else {
    setIsLoggedIn(false);
    setUser(null);
}
} catch (error) {
console.error('Error checking login status:', error);
localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
}
};

const handleLogin = async () => {
    await checkLoginStatus();
};

const handleLogout = async () => {
try {
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/logout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
},
});
if (response.ok) {
localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
} else {
    throw new Error('Logout failed');
}
} catch (error) {
    console.error('Error logging out:', error);
}
};

return (
    <AuthContext.Provider value={{ isLoggedIn, user, handleLogin, handleLogout }}>
        {children}
    </AuthContext.Provider>
);
};

export default AuthContext;
