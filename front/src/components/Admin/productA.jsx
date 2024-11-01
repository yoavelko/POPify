import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductBox from '../productBox/ProductBox';
import './productA.css';
import { MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', img: [], price: '', category: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // השגת הטוקן מ-localStorage
  
        if (!token) {
          throw new Error("No token found"); // טיפול במקרה שאין טוקן
        }
  
        const response = await axios.get('http://localhost:3001/admin/products', {
          headers: {
            'x-auth-token': token, // הוספת הטוקן ל-header
          },
        });
  
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to load products.');
      }
    };
  
    fetchProducts();
  }, []);
  

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
    const token = localStorage.getItem("token"); // השגת הטוקן מ-localStorage

    try {
      const response = await axios.patch(url, formData, {
        headers: {
          'x-auth-token': token, // הוספת הטוקן ל-header
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
    const token = localStorage.getItem("token"); // השגת הטוקן מ-localStorage

    try {
      const response = await axios.delete(url, {
        headers: {
          'x-auth-token': token, // הוספת הטוקן ל-header
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
        <button className="add-button" onClick={handleAddProduct}>
          <IoAddCircleOutline size={24} /> Add Product
        </button>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-item" key={product._id}>
            <ProductBox value={product} />
            <div className="product-actions">
              <button type="button" onClick={() => handleEdit(product)}>
                <MdOutlineModeEdit size={20} /> Edit
              </button>
              <button type="button" onClick={() => handleDelete(product._id)}>
                <AiOutlineDelete size={20} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>{editMode ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                autoComplete="off"
              />
              <input
                type="text"
                name="img"
                value={Array.isArray(formData.img) ? formData.img.join(',') : formData.img}
                onChange={handleChange}
                placeholder="Image URLs (comma-separated)"
                required
                autoComplete="off"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                required
                autoComplete="off"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
                autoComplete="off"
              />
              <button type="submit">{editMode ? "Save Changes" : "Add Product"}</button>
            </form>
          </div>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ProductManagement;
