import React, { useEffect, useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext'; // ייבוא הקונטקסט של המטבע

function extractDriveFileId(link) {
    if (typeof link !== "string") return null;
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    return match ? match[1] : null;
}

const WishlistPage = () => {
    const { currency, exchangeRate } = useCurrency(); // שימוש בקונטקסט של המטבע
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        // שליפת רשימת המשאלות מ-localStorage
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        // וידוא שכל ערך במחיר הוא מספרי
        const validatedWishlist = storedWishlist.map(item => ({
            ...item,
            price: Number(item.price) || 0 // המרת price למספר או 0 אם חסר ערך
        }));
        setWishlistItems(validatedWishlist);
    }, []);

    return (
        <div className="wishlist-page">
            <h2>Your Wishlist</h2>
            {wishlistItems.length > 0 ? (
                <div className="wishlist-items">
                    {wishlistItems.map((item) => {
                        const imgId = extractDriveFileId(item.image);
                        const imageUrl = imgId ? `https://drive.google.com/thumbnail?id=${imgId}` : '';
                        // אם המטבע הוא דולר, המרת המחיר; אחרת הצגת המחיר המקורי
                        const displayPrice = currency === 'USD' 
                            ? (item.price * exchangeRate).toFixed(2) 
                            : item.price.toFixed(2);

                        return (
                            <div key={item._id} className="wishlist-item">
                                {imageUrl && (
                                    <img src={imageUrl} alt={item.name} />
                                )}
                                <h3>{item.name}</h3>
                                <p>{currency === 'ILS' ? '₪' : '$'}{displayPrice}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Your wishlist is empty.</p>
            )}
        </div>
    );
};

export default WishlistPage;
