import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', img: [], price: '', category: '' });
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/admin/products'); // פניה לנתיב הנכון

        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to load products.');
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'img' ? (Array.isArray(value) ? value : value.split(',')) : value,
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', img: [], price: '', category: '' });
    setEditMode(false);
    setCurrentProductId(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode 
      ? `http://localhost:3001/products/update/${currentProductId}` 
      : `http://localhost:3001/products/create`;

    try {
      const method = editMode ? 'patch' : 'post';
      const response = await axios[method](url, formData);
      alert(response.data.message);

      if (editMode) {
        setProducts((prev) => prev.map((prod) => 
          prod._id === currentProductId ? response.data.product : prod
        ));
      } else {
        setProducts((prev) => [...prev, response.data.product]);
      }

      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Failed to submit form.');
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, img: product.img.join(','), price: product.price, category: product.category });
    setEditMode(true);
    setCurrentProductId(product._id);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/products/${productId}`);
      alert(response.data.message);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product.');
    }
  };

  return (
    <div className="product-management">
      <h2>Product Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="text"
          name="img"
          value={formData.img.join(',')}
          onChange={handleChange}
          placeholder="Image URLs (comma-separated)"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <button type="submit">{editMode ? 'Update Product' : 'Create Product'}</button>
        <button type="button" onClick={resetForm}>Cancel</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h3>Existing Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <span>{product.name} - ₪{product.price}</span>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
