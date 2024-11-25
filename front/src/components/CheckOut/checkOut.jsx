import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import axios from 'axios';
import './CheckOut.css';
import { useCart } from '../cartIcon';
import { useUser } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext'; // ייבוא קונטקסט המטבע

function extractDriveFileId(link) {
  if (typeof link !== "string") return null;
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? match[1] : null;
}

const CheckOut = () => {
  const { user } = useUser();
  const { setCartItemCount } = useCart(); // קריאה ל-useCart כאן, בקומפוננטה
  const userId = user ? user.id : null;

  const { currency, exchangeRate } = useCurrency(); // שימוש בקונטקסט של המטבע
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

  const updateQuantity = async (productId, delta) => {
    try {
      if (delta > 0) {
        // פלוס: הוספת פריט נוסף
        const response = await axios.patch('http://localhost:3001/user/add-to-cart', {
          userId: user.id,
          productId: productId,
        });

        if (response.status === 200) {
          console.log("Product added successfully:", response.data);

          // עדכון עגלה ב-Frontend
          setCartItems((prevItems) => {
            const updatedCart = prevItems.map((item) =>
              item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
          });
        }
      } else if (delta < 0) {
        // מינוס: הסרת פריט
        const response = await axios.patch('http://localhost:3001/user/remove-from-cart', {
          userId: user.id,
          productId: productId,
        });

        if (response.status === 200) {
          console.log("Product removed successfully:", response.data);

          // עדכון עגלה ב-Frontend
          setCartItems((prevItems) => {
            const updatedCart = prevItems.map((item) =>
              item._id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ).filter((item) => item.quantity > 0);

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
          });
        }
      }
    } catch (error) {
      console.error("Error updating product quantity:", error.message);
    }
  };


  function removeItem(targetId) {
    if (!userId) {
      alert("You must be logged in to remove items from the cart.");
      return;
    }

    // עדכון ה-סטייט המקומי וה-localStorage
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item._id !== targetId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItemCount(updatedCart.length); // עדכון המספר
      return updatedCart; // עדכון מיידי של הסטייט
    });

    // קריאה לשרת למחיקת המוצר
    axios.patch('http://localhost:3001/user/remove-from-cart', {
      userId: userId, // שימוש ב-userId מהקונטקסט
      productId: targetId,
    })
      .then((res) => {
        console.log(res);
        alert("Product removed from cart");
      })
      .catch((err) => {
        console.error("Error removing product from cart:", err);
      });
  }



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
        productId: item._id,
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
              {cartItems.map((item) => {
                const itemPrice = currency === 'USD'
                  ? (item.price * exchangeRate).toFixed(2)
                  : item.price.toFixed(2);

                const itemTotal = currency === 'USD'
                  ? (item.price * item.quantity * exchangeRate).toFixed(2)
                  : (item.price * item.quantity).toFixed(2);

                return (
                  <tr key={item._id}>
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
                    <td>{currency === 'ILS' ? '₪' : '$'}{itemPrice}</td>
                    <td className="quantity-control">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="quantity-button"
                        aria-label="הפחת כמות"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="quantity-button"
                        aria-label="הוסף כמות"
                      >
                        <FaPlus size={12} />
                      </button>

                    </td>
                    <td>{currency === 'ILS' ? '₪' : '$'}{itemTotal}</td>
                    <td>
                      <button
                        className="remove-item"
                        onClick={() => removeItem(item._id)}
                        aria-label="הסר פריט"
                      >
                        <MdOutlineCancel size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="checkout-summary">
            <div className="summary-details">
              <div className="summary-row">
                <span>סך ביניים:</span>
                <span>{currency === 'ILS' ? '₪' : '$'}{(subtotal * (currency === 'USD' ? exchangeRate : 1)).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>משלוח:</span>
                <span>{shipping === 0 ? 'חינם' : `${currency === 'ILS' ? '₪' : '$'}${(shipping * (currency === 'USD' ? exchangeRate : 1)).toFixed(2)}`}</span>
              </div>
              <div className="summary-row total">
                <span>סה"כ לתשלום:</span>
                <span>{currency === 'ILS' ? '₪' : '$'}{(total * (currency === 'USD' ? exchangeRate : 1)).toFixed(2)}</span>
              </div>
              {subtotal < 200 && (
                <div className="free-shipping-message">
                  חסרים לך {currency === 'ILS' ? '₪' : '$'}{((200 - subtotal) * (currency === 'USD' ? exchangeRate : 1)).toFixed(2)} למשלוח חינם!
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