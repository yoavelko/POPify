import './ProductBox.css';
import { addToCart, addToWishList } from '../../utils/UserRoutes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { useCart } from '../cartIcon';
import { useWishlist } from '../heartIcon';
import { useCurrency } from '../../context/CurrencyContext';
import { useUser } from '../../context/UserContext'; // ייבוא הקונטקסט

function extractDriveFileId(link) {
    if (typeof link !== "string") {
        return null;
    }
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    return match ? match[1] : null;
}

function ProductBox({ index, value }) {
    const { user } = useUser(); // קבלת פרטי המשתמש מהקונטקסט
    const userId = user ? user.id : null; // בדיקת משתמש מחובר
    const [hover, setHover] = useState(false);
    const { setCartItemCount } = useCart();
    const { addToWishlist } = useWishlist();
    const { currency, convertPrice } = useCurrency();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItemCount(storedCart.length);
    }, [setCartItemCount]);

    function addToCartFunc(value) {
        if (!userId) {
            alert("You must be logged in to add items to the cart.");
            return;
        }

        // שליפת עגלה מה-localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

        // בדיקת קיום המוצר בעגלה
        const existingItemIndex = storedCart.findIndex(item => item._id === value._id);

        if (existingItemIndex !== -1) {
            // אם המוצר כבר קיים בעגלה, נגדיל את הכמות המוצגת
            storedCart[existingItemIndex].quantity = (storedCart[existingItemIndex].quantity || 1) + 1;
        } else {
            // אם המוצר לא קיים, נוסיף אותו עם כמות ראשונית של 1
            storedCart.push({ ...value, quantity: 1 });
        }

        // עדכון ה-localStorage והסטייט
        localStorage.setItem('cart', JSON.stringify(storedCart));
        setCartItemCount(storedCart.reduce((acc, item) => acc + item.quantity, 0));

        // קריאה לשרת להוספת המוצר (כמופע חדש)
        axios
            .patch(addToCart, {
                userId: userId, // שימוש ב-userId מהקונטקסט
                productId: value._id
            })
            .then((res) => {
                console.log(res);
                alert("Product added to cart");
            })
            .catch((err) => {
                console.error("Error adding product to cart:", err);
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

    const imgIds = Array.isArray(value.img)
        ? value.img.map(link => extractDriveFileId(link))
        : [];
    const imageUrl = imgIds.length > 1
        ? (hover
            ? `https://drive.google.com/thumbnail?id=${imgIds[1]}`
            : `https://drive.google.com/thumbnail?id=${imgIds[0]}`
        )
        : `https://via.placeholder.com/150`; // ברירת מחדל במקרה של תמונה חסרה

    const convertedPrice = convertPrice(value.price || 0);

    return (
        <div id='product-box-container' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <img className='box-img' src={imageUrl} alt="Product Image" />
            <div>{value.name || "Unnamed Product"}</div>
            <div>{value.category || "Uncategorized"}</div>
            <div>{convertedPrice} {currency === "ILS" ? "₪" : "$"}</div>
            <div className='product-buttons-container'>
                <button className="button" onClick={() => addToCartFunc(value)}>Cart</button>
                <button className="button" onClick={() => handleAddToWishlist(value)}>Wish</button>
            </div>
        </div>
    );
}

export default ProductBox;