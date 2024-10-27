import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import './CheckOut.css';

function extractDriveFileId(link) {
  if (typeof link !== "string") return null;
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? match[1] : null;
}

const CheckOut = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // טעינת העגלה והדפסת תוכן לדיבוג
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        console.log('Loading cart contents:', storedCart);
        
        // וידוא שלכל פריט יש ID ייחודי וכמות
        const validatedCart = storedCart.map((item, index) => ({
          ...item,
          id: item.id || `item-${index}`, // אם אין ID, ניצור אחד
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        }));
        
        console.log('Validated cart:', validatedCart);
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
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (targetId, delta) => {
    console.log('Updating quantity for item:', targetId, 'delta:', delta);
    
    setCartItems(prevCartItems => {
      const updatedCart = prevCartItems.map(item => {
        if (item.id === targetId) {
          const newQuantity = Math.max(1, (item.quantity || 1) + delta);
          console.log(`Updating item ${item.id} (${item.name}) from ${item.quantity} to ${newQuantity}`);
          return {
            ...item,
            quantity: newQuantity
          };
        }
        return item;
      });
      
      console.log('Updated cart:', updatedCart);
      return updatedCart;
    });
  };

  const removeItem = (targetId) => {
    console.log('Removing item:', targetId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== targetId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('אנא הוסף מוצרים לעגלה לפני המעבר לקופה');
      return;
    }
    alert('מעבר לקופה');
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
              {cartItems.map(item => {
                console.log('Rendering item:', item); // דיבוג
                return (
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
                    <td>₪{(Number(item.price) * item.quantity).toFixed(2)}</td>
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
                );
              })}
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
            <button className="checkout-button" onClick={handleCheckout}>
              מעבר לקופה
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOut;