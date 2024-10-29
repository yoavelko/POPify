import './ProductBox.css';
import { addToCart, addToWishList } from '../../utils/UserRoutes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { useCart } from '../cartIcon';

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

function ProductBox({ value, onEdit }) {
    const [hover, setHover] = useState(false);
    const { setCartItemCount } = useCart();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(storedCart.length);
    }, []);

    function addToCartFunc(value) {
        const userId = cookies.get("userId");
        if (!userId) {
            alert("User not logged in.");
            return;
        }

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

    function addToWishListFunc(value) {
        const userId = cookies.get("userId");
        if (!userId) {
            alert("User not logged in.");
            return;
        }

        axios.patch(addToWishList, {
            userId: userId,
            productId: value._id
        })
            .then((res) => {
                console.log(res);
                alert("Product added to wish list");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const imgIds = Array.isArray(value.img) && value.img.length > 0 
        ? value.img.map(link => extractDriveFileId(link))
        : [];
    const imageUrl = imgIds.length > 0 
        ? (hover ? `https://drive.google.com/thumbnail?id=${imgIds[1]}` : `https://drive.google.com/thumbnail?id=${imgIds[0]}`)
        : "default-image-url.jpg"; // URL לתמונת ברירת מחדל

    return (
        <div id='product-box-container' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <img className='box-img' src={imageUrl} alt="Product Image" />
            <div>{value.name}</div>
            <div>{value.category}</div>
            <div>{value.price} ₪</div>
            <div className='product-buttons-container'>
                <button className="button" onClick={() => addToCartFunc(value)}>Cart</button>
                <button className="button" onClick={() => addToWishListFunc(value)}>Wish</button>
            </div>
        </div>
    );
}

export default ProductBox;
