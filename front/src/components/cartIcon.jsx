import axios from "axios";
import cookies from "js-cookie";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(storedCart.length);
    }, []);

    return (
        <CartContext.Provider value={{ cartItemCount, setCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};