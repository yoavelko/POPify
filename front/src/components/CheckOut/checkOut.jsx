import './CheckOut.css';
import Subtotal from './Subtotal';

function CheckOut(){
    return(
        <div className='checkout'>
            <h1>Check Out</h1>
            <div className='checkout_left'>
            <div>
                <h2 className='checkout_title'>Your shopping cart is empty</h2>
                <p>You have no items in your basket</p>

            </div>
            </div>
            <div className='checkout_right'>
        <Subtotal/>
            </div>
        </div>

        
    )
}