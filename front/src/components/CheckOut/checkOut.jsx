import React, { useEffect, useState } from 'react';
import './CheckOut.css';
import Subtotal from './Subtotal';

function CheckOut() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    return (
        
        <div className='checkout'>
            
            <h1>Check Out</h1>
            <div className='checkout_left'>
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <div key={index} className='checkout_item'>
                            <img src={item.img[0]} alt={item.name} />
                            <div className='checkout_info'>
                                <p>{item.name}</p>
                                <p>Price: {item.price} ₪</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <h2 className='checkout_title'>Your shopping cart is empty</h2>
                        <p>You have no items in your basket</p>
                    </div>
                )}
            </div>
            <div className='checkout_right'>
                <Subtotal />
            </div>
        </div>
    );
}

export default CheckOut;
