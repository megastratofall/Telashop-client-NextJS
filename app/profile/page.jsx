"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Profile.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
const [user, setUser] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
const fetchUserData = async () => {
try {
    const response = await fetch('http://localhost:8000/api/client/profile', {
    headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
},
});

if (!response.ok) {
throw new Error('Failed to fetch user data');
}

const data = await response.json();
    setUser(data);
} catch (error) {
    console.error('Error fetching user data:', error);
    setError('Error fetching user data. Please try again later.');
} finally {
    setIsLoading(false);
}
};

fetchUserData();
}, []);

if (isLoading) {
return (
<div className={styles.loadingContainer}>
<div className={styles.loading}>Loading...</div>
</div>
);
}

if (error) {
return (
<div className={styles.errorContainer}>
    <p className={styles.error}>{error}</p>
</div>
);
}

if (!user) {
return (
<div className={styles.errorContainer}>
    <p className={styles.error}>No user data available.</p>
</div>
);
}

return (
<div className={styles.profileContainer}>
<div className={styles.profileCard}>
    <Image 
    src="http://localhost:8000/storage/usericon.png" 
    alt="User Icon" 
    className={styles.userIcon}
    width={100}
    height={100}/>
    <h2>{user.name}</h2>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Dirección:</strong> {user.address}</p>
</div>
</div>
);
};

export default Profile;