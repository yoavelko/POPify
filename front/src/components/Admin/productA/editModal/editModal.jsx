import { useState } from 'react';
import './editModal.css';
import { updateProduct } from '../../../../utils/AdminRoutes';
import axios from 'axios'

function EditModal({ product, setIsModalOpen }) {

    const [input, setInput] = useState(null);
    const [editProd, setEditProd] = useState(product);
    const [edit, setEdit] = useState({
        name: false,
        img: false,
        price: false,
        category: false,
    });

    function handleEdit(type) {
        if (edit[type] && input != null) {
            setEditProd((prevState) => ({
                ...prevState,
                [type]: input,
            }))
            setInput(null);
        }

        setEdit((prevState) => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    }

    function handleSubmit() {

        if (
            edit.name || edit.img || edit.price || edit.category
        ) {
            alert('Please submit all fields first')
        } else {

            axios.patch(`${updateProduct}/${editProd._id}`, {
                name: editProd.name,
                price: editProd.price,
                img: editProd.img,
                category: editProd.category
            })
                .then((res) => {
                    console.log(res.data);
                    alert("Product updated");
                    setIsModalOpen(false);
                })
                .catch((err) => {
                    console.error("Error updating:", err.response?.data || err.message);
                });
        }
    }

    return (
        <div className="edit-modal-container">
            <div className='edit-modal-header'>Edit Product</div>
            <div className="edit-line-flexer">
                <div className='edit-inline-flexer'>
                    name: {edit.name ? (
                        <input type="text" placeholder={product.name} id='edit-input' onChange={(e) => setInput(e.target.value)} />
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
                    image link:&nbsp; {edit.img ? (
                        <input type="text" placeholder={product.img} id='edit-input' onChange={(e) => setInput(e.target.value)} />
                    ) : (
                        <span className='edit-overflow'>{product.img}</span>
                    )}
                </div>
                <button onClick={() => handleEdit('img')} className='submit-btn'>{
                    edit.img ? (
                        <span>submit</span>
                    ) : (
                        <span>edit</span>
                    )
                }</button>
            </div>
            <div className="edit-line-flexer">
                <div className='edit-inline-flexer'>
                    category: {edit.category ? (
                        <input type="text" placeholder={product.category} id='edit-input' onChange={(e) => setInput(e.target.value)} />
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
            <div className="edit-line-flexer">
                <div className='edit-inline-flexer'>
                    price: {edit.price ? (
                        <input type="text" placeholder={product.price} id='edit-input' onChange={(e) => setInput(e.target.value)} />
                    ) : (
                        product.price
                    )
                    }
                </div>
                <button onClick={() => handleEdit('price')} className='submit-btn'>{
                    edit.price ? (
                        <span>submit</span>
                    ) : (
                        <span>edit</span>
                    )
                }</button>
            </div>
            <div className='edit-modal-btn-container'>
                <button onClick={handleSubmit} className='edit-submit-btn'>Submit Changes</button>
            </div>
        </div>
    );
}

export default EditModal;
