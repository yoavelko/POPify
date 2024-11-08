import React, { useState } from 'react';
import { useUser } from '../../context/UserContext'; // ייבוא ההקשר של המשתמש
import ProductBox from '../productBox/ProductBox';
import './productA.css';
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";

const ProductManagement = () => {
  const { products, isAdmin } = useUser(); // שימוש במוצרים ובמצב מנהל מההקשר
  const [formData, setFormData] = useState({ name: '', img: [], price: '', category: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleEdit = (product) => {
    setFormData({ 
      name: product.name, 
      img: Array.isArray(product.img) ? product.img : [product.img], 
      price: product.price, 
      category: product.category 
    });
    setEditMode(true);
    setCurrentProductId(product._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:3001/admin/update-product/${currentProductId}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(url, formData, {
        headers: {
          'x-auth-token': token,
        },
      });
      alert(response.data.message);

      if (response.data.success) {
        setProducts((prev) => prev.map((prod) => 
          prod._id === currentProductId ? response.data.product : prod
        ));
      } else {
        setErrorMessage("Failed to update product in the database.");
      }

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to submit form.');
    }
  };

  const handleDelete = async (productId) => {
    const url = `http://localhost:3001/admin/products/${productId}`;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(url, {
        headers: {
          'x-auth-token': token,
        },
      });
      alert(response.data.message);

      if (response.status === 200) {
        setProducts((prev) => prev.filter((prod) => prod._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product.');
    }
  };

  const handleAddProduct = () => {
    setFormData({ name: '', img: [], price: '', category: '' });
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'img' ? value.split(',') : value,
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', img: [], price: '', category: '' });
    setEditMode(false);
    setCurrentProductId(null);
    setErrorMessage('');
  };

  return (
    <div className="product-management">
      <div className="header">
        <h2>Product Management</h2>
        {isAdmin && (
          <button className="add-button" onClick={handleAddProduct}>
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

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>{editMode ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              {/* Form inputs remain unchanged */}
            </form>
          </div>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ProductManagement;
