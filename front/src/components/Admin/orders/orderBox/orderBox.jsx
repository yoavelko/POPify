import './orderBox.css'
import axios from 'axios'
import { FaTrash } from "react-icons/fa";
import { updateOrderStatus } from '../../../../utils/OrderRoutes';

function OrderBox({ value, setUpdate, update }) {

    async function handleStatus(status) {
        try {
            const response = await axios.patch(updateOrderStatus, {
                orderId: value._id,
                status: status
            });
            console.log(`${response.data.message}: ${status}`);
            setUpdate(!update)
        } catch (error) {
            console.log(error.response?.data?.message || 'Error updating order status');
        }
    }

const deleteOrder = async (orderId) => {
  if (!window.confirm('Are you sure you want to delete this order?')) {
    return; 
  }
  try {
    // קריאה לשרת למחיקת ההזמנה
    const response = await axios.patch(`http://localhost:3001/admin/orders/${orderId}/delete`);

    if (response.status === 200) {
      alert('Order deleted successfully!');
      return response.data; // החזרת נתוני ההזמנה שנמחקה
    } else {
      console.error('Failed to delete order:', response.data.message);
      alert('Failed to delete the order.');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    alert('An error occurred while deleting the order.');
  }
};


    return (
        <div className='order-box-container'>
            <div className='delete' onClick={() => deleteOrder(value._id)}><FaTrash  /></div>
            <div>Order ID: <span className='order-box-keys'>{value._id}</span></div>
            <div>Total products in order: <span className='order-box-keys'>{value.productArr.length}</span></div>
            <div>Total sum: <span className='order-box-keys'>{value.totalSum}</span></div>
            <div>Order address: <span className='order-box-keys'>{value.address}</span></div>
            <div>
                <div>
                    Order status:&nbsp;
                    <span className={value.status}>
                        {value.status}
                    </span>
                </div>
                {
                    value.status == 'Pending' ?
                        <div className='order-box-btn-flex'>
                            <div className='order-box-btn-flex-inner'>
                                <button id='approve-btn' className='status-btn' onClick={() => handleStatus('Approved')}>Approve Order</button>
                            </div>
                            <div className='order-box-btn-flex-inner'>
                                <button id='decline-btn' className='status-btn' onClick={() => handleStatus('Declined')}>Decline Order</button>
                            </div>
                        </div>
                        :
                        <div className='order-box-btn-flex'>
                            <div className='order-box-pending-btn-flex-inner'>
                                <button id='pending-btn' className='status-btn' onClick={() => handleStatus('Pending')}>Back to Pending</button>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default OrderBox;