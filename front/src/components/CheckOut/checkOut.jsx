import React, { useEffect, useState } from 'react';
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import Subtotal from './Subtotal';

function CheckOut() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="shopping-cart-page">
      
        <h2>סל קניות</h2>
        <div className="checkout_content">
          <div className="checkout_left">
            {cartItems.length > 0 ? (
              <div className="cart-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img src={item.img[0]} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-price">₪{item.price.toFixed(2)}</div>
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><FaMinus size={16} /></button>
                        <span>{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><FaPlus size={16} /></button>
                      </div>
                    </div>
                    <div className="item-total">
                      <span>סה"כ: ₪{((item.price * (item.quantity || 1))).toFixed(2)}</span>
                      <button className="remove-item" onClick={() => removeItem(item.id)}><MdOutlineCancel size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart">
                <h2 className="checkout_title">סל הקניות שלך ריק</h2>
                <p>אין לך פריטים בסל</p>
              </div>
            )}
          </div>
          <div className="checkout_right">
            <Subtotal />
          </div>
        </div>
    </div>
  );
}

export default CheckOut;