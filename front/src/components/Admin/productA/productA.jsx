import React, { useState, useEffect } from 'react';
import ProductBox from '../../productBox/ProductBox';
import './productA.css';
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import NewModal from './newModal/newModal';

const ProductManagement = () => {
  const { products, isAdmin, setProducts } = useUser(); // שימוש בקונטקסט
  const [formData, setFormData] = useState({ name: '', img: [], price: '', category: '' });
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false); // מצב להצגת NewModal

  isModalOpen || showNewModal ? disableBodyScroll(document) : enableBodyScroll(document);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // פונקציה לרענון רשימת המוצרים
  const refreshProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/products");
      setProducts(response.data.products); // עדכון רשימת המוצרים
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // טיפול בעריכת מוצר
  const handleEdit = (product) => {

    setFormData({
      name: product.name,
      img: Array.isArray(product.img) ? product.img : [product.img],
      price: product.price,
      category: product.category,
    });
    setCurrentProductId(product._id);
    setIsEditMode(true);
    setIsModalOpen(!isModalOpen); // פתיחת המודאל לעריכה
  };

  // שליחת טופס עדכון
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:3001/admin/update-product/${currentProductId}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(url, formData, {
        headers: {
          "x-auth-token": token,
        },
      });
      alert(response.data.message);

      if (response.data.success) {
        refreshProducts(); // רענון המוצרים לאחר עדכון
      }
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // מחיקת מוצר
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    console.log(`product id: ${productId}`);
    
    try {
      const response = await axios.delete(`http://localhost:3001/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response) {
        alert('Product deleted successfully');
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-management">
      <div className="header">
        <h2>Product Management</h2>
        {isAdmin && (
          <button
            className="add-button"
            onClick={() => {
              setShowNewModal(true);
              console.log("Show NewModal:", true);
            }}
          >
            <IoAddCircleOutline size={24} /> Add Product
          </button>
        )}
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product._id}>
            <ProductBox value={product} />
            {isAdmin && (
              <div className="product-actions">
                <button type="button" onClick={() => handleEdit(product)}>
                  <MdOutlineModeEdit size={20} /> Edit
                </button>
                <button type="button" onClick={() => handleDelete(product._id)}>
                  <AiOutlineDelete size={20} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* מודאל לעריכת מוצר */}
      {isModalOpen && (
        <div className="modal" id='modal'>
          <div className='edit-modal-container'>
            <div className='edit-modal-inner'>
              <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                <h3>Edit Product</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Images (comma-separated URLs):
                    <input
                      type="text"
                      name="img"
                      value={formData.img.join(',')}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value.split(',') })}
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Category:
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </label>
                  <button type="submit">Update Product</button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* מודאל להוספת מוצר */}
      {showNewModal && (
        <NewModal setIsModalOpen={setShowNewModal} />
      )}
    </div>
  );
};

export default ProductManagement;
