import { useEffect, useState } from 'react';
import './Orders.css'
import axios from 'axios';
import { getAllOrders } from '../../../utils/OrderRoutes';
import OrderBox from './orderBox/orderBox';

function Orders() {

    const [allOrders, setAllOrders] = useState();
    const [update, setUpdate] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(getAllOrders);
            const data = response.data.orders;
            console.log(data);
            setAllOrders(data);
        } catch (error) {
            console.error("Error fetching products:", error.message);
            setProducts([]);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [update])

    return (
        <div className='admin-orders-container'>
            <div className='admin-orders-header'>Orders Managment</div>
            {allOrders && allOrders.map((value, index) => (
                <OrderBox key={index} value={value} setUpdate={setUpdate} update={update}/>
            ))}
        </div>
    )
}

export default Orders;