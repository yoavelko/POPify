import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import axios from 'axios';
import './CheckOut.css';
import { useUser } from '../../context/UserContext'; // שימוש נכון בהקשר המשתמש

// פונקציה לחילוץ מזהה תמונה מגוגל דרייב
function extractDriveFileId(link) {
  if (typeof link !== "string") return null;
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? match[1] : null;
}

const CheckOut = () => {
  const { user } = useUser(); // קבלת נתוני משתמש מה-UserContext
  const userId = user ? user.id : null;

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const validatedCart = storedCart.map((item, index) => ({
          ...item,
          id: item.id || `item-${index}`,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        }));
        setCartItems(validatedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const calculateSubtotal = () => {
      const newSubtotal = cartItems.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );
      setSubtotal(newSubtotal);
    };

    calculateSubtotal();
  }, [cartItems]);

  const updateQuantity = (targetId, delta) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === targetId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (targetId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== targetId));
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (cartItems.length === 0) {
      alert('אנא הוסף מוצרים לעגלה לפני המעבר לקופה');
      return;
    }

    setLoading(true);
    setError('');

    const orderData = {
      productArr: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        img: item.img,
        price: item.price,
        quantity: item.quantity
      })),
      userId: userId,
      status: "Pending",
      totalSum: subtotal,
      address: "City, Street"
    };
    
    try {
      // שינוי הנתיב כדי להתאים לשרת
      const response = await axios.post('http://localhost:3001/order', orderData);
      console.log('Order created:', response.data);
      alert('ההזמנה בוצעה בהצלחה');
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error creating order:', error);
      setError('הייתה בעיה ביצירת ההזמנה. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  const shipping = subtotal > 200 ? 0 : 30;
  const total = subtotal + shipping;

  return (
    <div className="shopping-cart-page">
      <h2>סל קניות</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>סל הקניות שלך ריק</p>
          <button className="continue-shopping" onClick={() => window.history.back()}>
            המשך בקניות
          </button>
        </div>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>מוצר</th>
                <th>מחיר</th>
                <th>כמות</th>
                <th>סה"כ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="product-info">
                    <img
                      src={`https://drive.google.com/thumbnail?id=${extractDriveFileId(item.img?.[0]) || ''}`}
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="product-details">
                      <div className="product-name">{item.name}</div>
                      {item.size && <div className="product-size">מידה: {item.size}</div>}
                    </div>
                  </td>
                  <td>₪{Number(item.price).toFixed(2)}</td>
                  <td className="quantity-control">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="quantity-button"
                      aria-label="הפחת כמות"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="quantity-button"
                      aria-label="הוסף כמות"
                    >
                      <FaPlus size={12} />
                    </button>
                  </td>
                  <td>₪{(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-item"
                      onClick={() => removeItem(item.id)}
                      aria-label="הסר פריט"
                    >
                      <MdOutlineCancel size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="checkout-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span>סך ביניים:</span>
                <span>₪{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>משלוח:</span>
                <span>{shipping === 0 ? 'חינם' : `₪${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total">
                <span>סה"כ לתשלום:</span>
                <span>₪{total.toFixed(2)}</span>
              </div>
              {subtotal < 200 && (
                <div className="free-shipping-message">
                  חסרים לך ₪{(200 - subtotal).toFixed(2)} למשלוח חינם!
                </div>
              )}
            </div>
            <button className="checkout-button" onClick={handleCheckout} disabled={loading}>
              {loading ? 'ממתין...' : 'מעבר לקופה'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOut;
