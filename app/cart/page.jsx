"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Cart.module.css';

const Cart = () => {
const [cartItems, setCartItems] = useState([]);

useEffect(() => {
    fetchCartItems();
}, []);

const fetchCartItems = async () => {
try {
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/cart', {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
},
});
if (!response.ok) throw new Error('Failed to fetch cart items');
const data = await response.json();
    setCartItems(data);
} catch (error) {
    console.error('Error fetching cart items:', error);
    toast.error('Error al cargar los items del carrito');
}
};

const removeFromCart = async (cartItemId) => {
try {
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/cart/remove', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
},
    body: JSON.stringify({ cart_item_id: cartItemId }),
});
if (!response.ok) throw new Error('Failed to remove item from cart');
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    toast.success('Producto eliminado del carrito correctamente');
} catch (error) {
    console.error('Error removing item from cart:', error);
    toast.error('Error al eliminar producto del carrito');
}
};

const handlePayment = async () => {
try {
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/payment/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
},
});
if (!response.ok) throw new Error('Failed to create payment preference');
    const data = await response.json();
    const initPoint = data.init_point;
if (initPoint) {
    window.location.href = initPoint;
} else {
    throw new Error('No se encontró el punto de inicio');
}
} catch (error) {
console.error('Error al crear preferencia de pago:', error);
toast.error('Error al crear la preferencia de pago');
}
};

const totalPrice = cartItems.reduce((acc, item) => acc + parseFloat(item.product.price), 0).toFixed(2);

return (
<div className={styles.cartContainer}>
    <h1>Cart</h1>
    {cartItems.length === 0 ? (
    <p>Your cart is empty.</p>
) : (
    <div>
<table className={styles.cartTable}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {cartItems.map((item) => (
      <tr key={item.id}>
        <td>{item.product.name}</td>
        <td>${item.product.price}</td>
        <td>
          <button className={styles.removeButton} onClick={() => removeFromCart(item.id)}>Remove</button>
        </td>
      </tr>
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan="2">Total:</td>
      <td>${totalPrice}</td>
    </tr>
  </tfoot>
</table>
    <button className={styles.buyButton} onClick={handlePayment}>Buy Now</button>
</div>
)}
</div>
);
};

export default Cart;