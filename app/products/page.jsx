'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Product.module.css';
import Image from 'next/image';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/api/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [router]);

    const addToCart = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'include',
                body: JSON.stringify({ product_id: productId, quantity: 1 }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            toast.success('Producto agregado al carrito correctamente');
            setCartCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Error al agregar producto al carrito');
        }
    };

    return (
        <div className={styles.productList}>
            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                <>
                    <h1>Lista de Productos</h1>
                    <div className={styles.productsGrid}>
                        {products.map((product) => (
                            <div key={product.id} className={styles.productCard}>
                                <Image 
                                    src={`http://localhost:8000/storage/${product.image}`} 
                                    alt={product.name}
                                    width={200}
                                    height={200}
                                />
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <div className={styles.productFooter}>
                                    <button className={styles.addToCart} onClick={() => addToCart(product.id)}>
                                        Add to cart
                                    </button>
                                    <span>${product.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductList;
