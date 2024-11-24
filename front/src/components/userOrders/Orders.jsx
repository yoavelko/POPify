import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCurrency } from '../../context/CurrencyContext';
import './orders.css';

function Order() {
  const { currency, convertPrice, toggleCurrency } = useCurrency(); // שימוש בקונטקסט המטבע
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({}); // עוקב אחר מצב פתיחה של כל הזמנה

  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        throw new Error("User not found in localStorage");
      }

      const user = JSON.parse(userString);
      const userId = user.id;

      const response = await axios.get('http://localhost:3001/order/user-orders', { params: { id: userId } });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Could not fetch orders. Please try again later.');
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevExpanded) => ({
      ...prevExpanded,
      [orderId]: !prevExpanded[orderId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1>Order History</h1>
        <button onClick={toggleCurrency} className="currency-toggle">
          {currency === 'ILS' ? 'Switch to USD' : 'Switch to ILS'}
        </button>
        <p className="order-count">{orders?.length || 0} Orders</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      {orders && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header" onClick={() => toggleOrderDetails(order._id)}>
                <div className="order-info">
                  <div className="order-id">
                    <span className="label">Order ID:</span>
                    <span className="value">{order._id}</span>
                  </div>
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                <div className="toggle-arrow">
                  {expandedOrders[order._id] ? '▲' : '▼'}
                </div>
              </div>

              {expandedOrders[order._id] && ( // הצגת פרטי ההזמנה רק אם הכרטיס פתוח
                <>
                  <div className="order-items">
                    {order.productArr.map((product, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <img 
                            src={product.image || '/placeholder-image.jpg'} 
                            alt={product.name}
                            className="item-image"
                          />
                          <div className="item-details">
                            <h3 className="item-name">{product.name}</h3>
                            <p className="item-quantity">Quantity: {product.quantity}</p>
                          </div>
                        </div>
                        <div className="item-price">
                          {currency} {convertPrice(product.price * product.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="shipping-info">
                      <h4>Shipping Address</h4>
                      <p>{order.address}</p>
                    </div>
                    <div className="order-summary">
                      <div className="summary-item">
                        <span>Subtotal</span>
                        <span>{currency} {convertPrice(order.totalSum)}</span>
                      </div>
                      <div className="summary-item">
                        <span>Shipping</span>
                        <span>{currency} 0.00</span>
                      </div>
                      <div className="summary-item total">
                        <span>Total</span>
                        <span>{currency} {convertPrice(order.totalSum)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No Orders Yet</h2>
          <p>When you place an order, it will appear here</p>
        </div>
      )}
    </div>
  );
}

export default Order;