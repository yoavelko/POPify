// WishlistPage.jsx
import React from 'react';
import { useWishlist } from '../heartIcon';

const WishlistPage = () => {
    const { wishlistItems } = useWishlist(); // נניח ש-wishlistItems הוא מערך הפריטים ב-Wishlist

    return (
        <div className="wishlist-page">
            <h2>Your Wishlist</h2>
            {wishlistItems.length > 0 ? (
                <div className="wishlist-items">
                    {wishlistItems.map((item) => (
                        <div key={item._id} className="wishlist-item">
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>{item.price} ₪</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Your wishlist is empty.</p>
            )}
        </div>
    );
};

export default WishlistPage;
