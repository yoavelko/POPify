import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItemCount, setWishlistItemCount] = useState(0);

    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistItemCount(storedWishlist.length);
    }, []);

    const addToWishlist = (item) => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        storedWishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
        setWishlistItemCount(storedWishlist.length);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItemCount, addToWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
