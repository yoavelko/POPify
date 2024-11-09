import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistItemCount, setWishlistItemCount] = useState(0);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistItems(storedWishlist);
        setWishlistItemCount(storedWishlist.length); // עדכון מספר הפריטים בזמן העלאה
    }, []);

    const addToWishlist = (item) => {
        // בדיקה אם המוצר כבר קיים ברשימת המשאלות
        if (!wishlistItems.some(existingItem => existingItem._id === item._id)) {
            const updatedWishlist = [...wishlistItems, item];
            setWishlistItems(updatedWishlist);
            setWishlistItemCount(updatedWishlist.length); // עדכון מספר הפריטים
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); // שמירת הרשימה ב-localStorage
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, wishlistItemCount }}>
            {children}
        </WishlistContext.Provider>
    );
};
