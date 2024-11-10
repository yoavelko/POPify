import { useState } from 'react';
import './editModal.css';

function EditModal({ product }) {

    const [input, setInput] = useState();
    const [edit, setEdit] = useState({
        name: false,
        img: false,
        price: false,
        category: false,
    });

    function handleEdit(type) {
        if (edit[type]) {
            console.log(input);
            setInput(null);
        }

        setEdit((prevState) => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    }

    return (
        <div className="edit-modal-container">
            <div>Edit Product</div>
            <div className="edit-line-flexer">
                <div className='edit-inline-flexer'>
                    name: {edit.name ? (
                        <input type="text" placeholder={product.name} className='edit-input' onChange={(e) => setInput(e.target.value)}/>
                    ) : (
                        product.name
                    )}
                </div>
                <button onClick={() => handleEdit('name')} className='submit-btn'>{
                    edit.name ? (
                        <span>submit</span>
                    ) : (
                        <span>edit</span>
                    )
                }</button>
            </div>
            <div className="edit-line-flexer">
                <div className='edit-inline-flexer'>
                    price: {edit.price ? (
                        <input type="text" placeholder={product.price} className='edit-input' onChange={(e) => setInput(e.target.value)}/>
                    ) : (
                        product.price
                    )}
                </div>
                <button onClick={() => handleEdit('price')} className='submit-btn'>{
                    edit.price ? (
                        <span>submit</span>
                    ) : (
                        <span>edit</span>
                    )
                }</button>
            </div>
            <div className="edit-line-flexer">
                <div className='edit-inline-flexer'>
                    category: {edit.category ? (
                        <input type="text" placeholder={product.category} className='edit-input' onChange={(e) => setInput(e.target.value)}/>
                    ) : (
                        product.category
                    )}
                </div>
                <button onClick={() => handleEdit('category')} className='submit-btn'>{
                    edit.category ? (
                        <span>submit</span>
                    ) : (
                        <span>edit</span>
                    )
                }</button>
            </div>
        </div>
    );
}

export default EditModal;
