import './ProductBox.css';
import { addToCart, addToWishList } from '../../utils/UserRoutes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { useCart } from '../cartIcon';
import { useWishlist } from '../heartIcon'; // ייבוא WishlistContext

function extractDriveFileId(link) {
    if (typeof link !== "string") {
        throw new Error("Input must be a string");
    }
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (match && match[1]) {
        return match[1];
    } else {
        console.error("Invalid Google Drive link format.");
        return null;
    }
}

function ProductBox({ index, value }) {
    const [hover, setHover] = useState(false);
    const { setCartItemCount } = useCart();
    const { addToWishlist } = useWishlist(); // ייבוא הפונקציה מהקונטקסט

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(storedCart.length);
    }, [setCartItemCount]);

    function addToCartFunc(value) {
        const userId = cookies.get("userId");
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        storedCart.push(value);
        localStorage.setItem('cart', JSON.stringify(storedCart));
        setCartItemCount(storedCart.length);

        axios.patch(addToCart, {
            userId: userId,
            productId: value._id
        })
            .then((res) => {
                console.log(res);
                alert("Product added to cart");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleAddToWishlist(value) {
        addToWishlist(value); // קריאה לפונקציה מ-WishlistContext כדי לעדכן את ה-Wishlist
        const userId = cookies.get("userId");
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        storedWishlist.push(value);
        localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
        setCartItemCount(storedWishlist.length);


        axios.patch(addToWishList, {
            userId: userId,
            productId: value._id
        })
        .then((res) => {
            console.log(res);
            alert("Product added to wishlist");
        })
        .catch((err) => {
            console.error("Error adding to wishlist:", err);
        });
    }

    const imgIds = value.img.map(link => extractDriveFileId(link));
    const imageUrl = hover
        ? `https://drive.google.com/thumbnail?id=${imgIds[1]}`
        : `https://drive.google.com/thumbnail?id=${imgIds[0]}`;

    return (
        <div id='product-box-container' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <img className='box-img' src={imageUrl} alt="None" />
            <div>{value.name}</div>
            <div>{value.category}</div>
            <div>{value.price} ₪</div>
            <div className='product-buttons-container'>
                <button className="button" onClick={() => addToCartFunc(value)}>Cart</button>
                <button className="button" onClick={() => handleAddToWishlist(value)}>Wish</button>
            </div>
        </div>
    );
}


export default ProductBox;
