import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Order() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered'); // Debugging line
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    console.log('getAllOrders function called'); // Debugging line
    try {
      const userString = localStorage.getItem("user"); // שליפת אובייקט המשתמש כ-JSON מ-localStorage
      if (!userString) {
        throw new Error("User not found in localStorage");
      }

      const user = JSON.parse(userString); // הפיכת המחרוזת לאובייקט
      const userId = user.id; // גישה ל-id של המשתמש
      console.log("User ID:", userId);

      const response = await axios.get('http://localhost:3001/order/user-orders', { params: { id: userId } });
      console.log('Response:', response.data); // Debugging line
      setOrders(response.data.orders); // Set the orders array from response
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Could not fetch orders. Please try again later.');
    }
  };
  
  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      {error && <p className="error-message">{error}</p>}
      {orders && orders.length > 0 ? ( // Checking if orders exists and has length
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <p>Order ID: {order._id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.totalSum}</p>
              <p>Address: {order.address}</p>
              <ul>
                {order.productArr.map((product, index) => (
                  <li key={index}>
                    <p>{product.name} - Quantity: {product.quantity}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Order;
