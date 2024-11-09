import './ProductBox.css';
import { addToCart, addToWishList } from '../../utils/UserRoutes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { useCart } from '../cartIcon';
import { useWishlist } from '../heartIcon';
import { useCurrency } from '../../context/CurrencyContext';

function extractDriveFileId(link) {
    if (typeof link !== "string") {
        return null;
    }
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    return match ? match[1] : null;
}

function ProductBox({ index, value }) {
    const [hover, setHover] = useState(false);
    const { setCartItemCount } = useCart();
    const { addToWishlist } = useWishlist();
    const { currency, convertPrice } = useCurrency();

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
        const userId = cookies.get("userId");
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        if (!storedWishlist.some(item => item._id === value._id)) {
            storedWishlist.push(value);
            localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
            addToWishlist(value);
        }
        
        axios.patch(addToWishList, {
            userId: userId,
            productId: value._id
        })
        .then((res) => {
            console.log(res.data);
            alert("Product added to wishlist");
        })
        .catch((err) => {
            console.error("Error adding to wishlist:", err.response?.data || err.message);
        });
    }

    const imgIds = value.img.map(link => extractDriveFileId(link));
    const imageUrl = hover
        ? `https://drive.google.com/thumbnail?id=${imgIds[1]}`
        : `https://drive.google.com/thumbnail?id=${imgIds[0]}`;
    
    const convertedPrice = convertPrice(value.price);

    return (
        <div id='product-box-container' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <img className='box-img' src={imageUrl} alt="None" />
            <div>{value.name}</div>
            <div>{value.category}</div>
            <div>{convertedPrice} {currency === "ILS" ? "₪" : "$"}</div>
            <div className='product-buttons-container'>
                <button className="button" onClick={() => addToCartFunc(value)}>Cart</button>
                <button className="button" onClick={() => handleAddToWishlist(value)}>Wish</button>
            </div>
        </div>
    );
}

export default ProductBox;
