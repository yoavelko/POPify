import './ProductBox.css'
import { addToCart, addToWishList } from '../../utils/UserRoutes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';

function extractDriveFileId(link) {
    // Ensure the input is a string
    if (typeof link !== "string") {
        throw new Error("Input must be a string");
    }

    // Use a regular expression to match the file ID part of the link
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);

    // If a match is found, return the file ID
    if (match && match[1]) {
        return match[1];
    } else {
        console.error("Invalid Google Drive link format.");
        return null;
    }
}

function addToCartFunc(value) {

    const userId = cookies.get("userId");

    axios.patch(addToCart, {
        userId: userId,
        productId: value._id
    })
        .then((res) => {
            console.log(res);
            alert("Product added to cart")
        })
        .catch((err) => {
            console.log(err);
        })
}

function addToWishListFunc(value) {

    const userId = cookies.get("userId");

    axios.patch(addToWishList, {
        userId: userId,
        productId: value._id
    })
        .then((res) => {
            console.log(res);
            alert("Product added to wish list")
        })
        .catch((err) => {
            console.log(err);
        })
}

function ProductBox({ index, value }) {

    const [hover, setHover] = useState(false);


    // Extracting the img IDs from the DB's links
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
                <button className="button" onClick={() => addToWishListFunc(value)}>Wish</button>
            </div>
        </div>
    )
}

export default ProductBox