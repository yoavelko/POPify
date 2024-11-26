import './newModal.css';
import { useState } from 'react';
import { createProduct } from '../../../../utils/AdminRoutes';
import axios from 'axios';
import { useUser } from '../../../../context/UserContext';

function NewModal({ setIsModalOpen }) {
    const { setProducts } = useUser();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        img: ['', ''], // מערך עבור שתי תמונות
        category: ''
    });

    const googleDriveLinkRegex = /^https:\/\/drive\.google\.com\/(?:file\/d\/[A-Za-z0-9_-]+\/view|drive\/folders\/[A-Za-z0-9_-]+)$/;

    const handleSubmit = async () => {
        if (!product.name) {
            alert('Product must have a name');
            return;
        }
        const price = Number(product.price);
        if (isNaN(price)) {
            alert('Price must be a valid number');
            return;
        }
        if (!product.category) {
            alert('Category is required');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3001/admin/new-product', {
                name: product.name,
                price: product.price,
                img: product.img, // מערך של שתי התמונות
                category: product.category
            });
    
            alert("New Product Added Successfully");
            setProducts((prevProducts) => [...prevProducts, response.data.product]);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error creating new product:", err.response?.data || err.message);
            alert("Failed to add the product. Please try again.");
        }
    };    

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                <h3>Add New Product</h3>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct((prev) => ({ ...prev, price: e.target.value }))}
                            required
                        />
                    </label>
                    <label>
                        First Image Link:
                        <input
                            type="text"
                            value={product.img[0]}
                            onChange={(e) =>
                                setProduct((prev) => {
                                    const updatedImg = [...prev.img];
                                    updatedImg[0] = e.target.value;
                                    return { ...prev, img: updatedImg };
                                })
                            }
                            required
                        />
                    </label>
                    <label>
                        Second Image Link:
                        <input
                            type="text"
                            value={product.img[1]}
                            onChange={(e) =>
                                setProduct((prev) => {
                                    const updatedImg = [...prev.img];
                                    updatedImg[1] = e.target.value;
                                    return { ...prev, img: updatedImg };
                                })
                            }
                            required
                        />
                    </label>
                    <label>
                        Category:
                        <select
                            value={product.category}
                            onChange={(e) => setProduct((prev) => ({ ...prev, category: e.target.value }))}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Marvel">Marvel</option>
                            <option value="DC">DC</option>
                            <option value="Disney">Disney</option>
                            <option value="Harry Potter">Harry Potter</option>
                        </select>
                    </label>
                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
}

export default NewModal;
