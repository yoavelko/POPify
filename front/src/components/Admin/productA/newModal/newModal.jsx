import './newModal.css'
import { useState } from 'react'
import { createProduct } from '../../../../utils/AdminRoutes';
import axios from 'axios';

function NewModal({ setIsModalOpen }) {

    const [product, setProduct] = useState({
        name: null,
        price: null,
        img: [null],
        category: null
    })

    const googleDriveLinkRegex = /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view$/;

    function handleSubmit() {

        if (!product.name) {
            alert('Product must have a name');
            return
        }
        const price = Number(product.price);
        if (isNaN(price)) {
            alert('Price must be a number');
            return;
        }
        if (!googleDriveLinkRegex.test(product.img)) {
            alert('Image must be a valid google drive link');
            return;
        }
        if (product.category == null) {
            alert('Category is required');
            return;
        }

        axios.post(createProduct, {
            name: product.name,
            price: product.price,
            img: product.img,
            category: product.category
        })
            .then((res) => {
                console.log(res.data);
                alert("New Product Added Successfully");
                setIsModalOpen(false);
            })
            .catch((err) => {
                console.error("Error creating new product:", err.response?.data || err.message);
            });

    }

    return (
        <div className='new-modal-container'>
            <div className='new-modal-header'>Add New Product</div>
            <div>
                <div>Product Name:&nbsp;</div>
                <input type="text" onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
                <div>Product Price:&nbsp;</div>
                <input type="text" onChange={(e) => setProduct((prev) => ({ ...prev, price: e.target.value }))} />
            </div>
            <div>
                <div>Image Link:&nbsp;</div>
                <input type="text" onChange={(e) => setProduct((prev) => ({ ...prev, img: [e.target.value] }))} />
            </div>
            <div className='new-modal-flexer'>
                <div>Category:&nbsp;</div>
                <select name="" id="" onChange={(e) => setProduct((prev) => ({ ...prev, category: e.target.value }))}>
                    <option value={null}>Category</option>
                    <option value="Marvel">Marvel</option>
                    <option value="DC">DC</option>
                    <option value="Disney">Disney</option>
                </select>
            </div>
            <div className='new-modal-btn-container'>
                <button className='new-modal-submit-btn' onClick={handleSubmit}>Add Product</button>
            </div>
        </div>
    )
}

export default NewModal