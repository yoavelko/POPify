import { useState } from 'react';
import { useUser } from '../../../../context/UserContext';
import axios from 'axios';

function EditProductModal({ closeModal }) {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("User data is missing. Please log in again.");
      return;
    }
    try {
      const response = await axios.put('http://localhost:3001/user/update-user', {
        userId: user.id,
        ...formData
      });

      if (response.status === 200) {
        alert('User details updated successfully');

        // עדכון הנתונים בקונטקסט וב-localStorage
        updateUser(response.data.user);

        // סגירת המודל לאחר העדכון
        closeModal();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating details');
    }
  };

  return (
    <div className="edit-modal-container">
      <h2>Update User Details</h2>
      <form onSubmit={handleUpdateSubmit}>
        <div className="edit-line-flexer">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="edit-input"
          />
        </div>
        <div className="edit-line-flexer">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="edit-input"
          />
        </div>
        <div className="edit-line-flexer">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="edit-input"
          />
        </div>
        <div className="edit-line-flexer">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="edit-input"
          />
        </div>
        <div className="edit-line-flexer">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="edit-input"
          />
        </div>
        <button type="submit" className="submit-btn">Update</button>
      </form>
    </div>
  );
}

export default EditProductModal;
