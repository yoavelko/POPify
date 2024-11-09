import React, { useEffect, useState } from 'react';

function extractDriveFileId(link) {
    if (typeof link !== "string") return null;
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    return match ? match[1] : null;
}

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        // שליפת רשימת המשאלות מ-localStorage
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistItems(storedWishlist);
    }, []);

    return (
        <div className="wishlist-page">
            <h2>Your Wishlist</h2>
            {wishlistItems.length > 0 ? (
                <div className="wishlist-items">
                    {wishlistItems.map((item) => {
                        // הפקת מזהה התמונה מתוך הקישור
                        const imgId = extractDriveFileId(item.image);
                        const imageUrl = imgId ? `https://drive.google.com/thumbnail?id=${imgId}` : '';

                        return (
                            <div key={item._id} className="wishlist-item">
                                {imageUrl && (
                                    <img src={imageUrl} alt={item.name} />
                                )}
                                <h3>{item.name}</h3>
                                <p>{item.price} ₪</p>
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
