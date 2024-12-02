import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './usersAdmin.css'; // Ensure you have appropriate styles
import { getUsers } from '../../../utils/AdminRoutes';
import Maps from './Maps/Maps';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const UserAdmin = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState(''); // שאילתת החיפוש
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [marked, setMarked] = useState(null);

  // Lock/unlock scroll when modal is open/closed
  useEffect(() => {
    if (isModalOpen) disableBodyScroll(document);
    else enableBodyScroll(document);
  }, [isModalOpen]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(getUsers);
      console.log("Fetched users:", response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: false,
    delete: false,
  });

  const createMessage = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: '', isError: false }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openAddModal = () => {
    setIsUpdateMode(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      password: '',
      isAdmin: false,
    });
    setIsModalOpen(true);
  };

  const openUpdateModal = (user) => {
    console.log("Opening update modal for user:", user);
    setIsUpdateMode(true);
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      isAdmin: user.isAdmin || false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      lastName: '',
      email: '',
      password: '',
      isAdmin: false,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lastName || !formData.email) {
      createMessage('Please fill in all required fields.', true);
      return;
    }

    if (isUpdateMode) {
      if (window.confirm('Are you sure you want to update this user?')) {
        await updateUser();
      }
    } else {
      if (window.confirm('Are you sure you want to add this user?')) {
        await addUser();
      }
    }
  };

  const updateUser = async () => {
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) delete updatedData.password;

      const response = await axios.patch(
        `http://localhost:3001/admin/update-user/${selectedUser._id}`,
        updatedData
      );

      if (response.status === 200) {
        createMessage(response.data.message, false);
        closeModal();
        getAllUsers();
      } else {
        createMessage(response.data.message || 'Failed to update the user.', true);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      createMessage('An error occurred while updating the user.', true);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/admin/add-user`, formData);

      if (response.status === 200) {
        createMessage(response.data.message, false);
        closeModal();
        getAllUsers();
      } else {
        createMessage(response.data.message || 'Failed to add the user.', true);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      createMessage('An error occurred while adding the user.', true);
    }
  };

  const deleteUser = async (userEmail) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await axios.delete(`/delete-user/${userEmail}`);
      if (response.status === 200) {
        createMessage(response.data.message, false);
        getAllUsers();
      } else {
        createMessage(response.data.message || 'Failed to delete the user.', true);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      createMessage('Failed to delete the user, please try again later.', true);
    }
  }
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setShowSearchResults(query.length > 0);
  }, [query]);

  return (
    <div className="user-admin-container">
      <div className="admin-header">
        <h1>User Administration</h1>
      </div>

      <div className="search-section">
        <form onSubmit={(e) => e.preventDefault()} className="search-form">
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {showSearchResults && (
            <div className="search-results">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="search-result-item"
                    onClick={() => {
                      setMarked(user); // עדכון המשתמש המסומן
                      setQuery(''); // איפוס תיבת החיפוש
                      setShowSearchResults(false); // סגירת תוצאות החיפוש
                    }}
                  >
                    {user.name} ({user.email})
                  </div>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </div>
          )}
          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={getAllUsers}
            >
              Show All Users
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={openAddModal}
            >
              Add New User
            </button>
          </div>
        </form>
      </div>

      <div className="content-layout">
        <div className="maps-container">
          <Maps users={users} setMarked={setMarked} />
          {marked && (
            <div className="marked-user-card">
              <h3>User Details</h3>
              <p><strong>Name:</strong> {marked.name}</p>
              <p><strong>Email:</strong> {marked.email}</p>
              <p><strong>Admin Status:</strong> {marked.isAdmin ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        <div className="users-container">
          {users.map((user) => (
            <div className="user-card" key={user._id}>
              <div className="user-header">
                <h3>{user.name} {user.lastName}</h3>
                <span className={`admin-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              <div className="user-details">
                <p><strong>Email:</strong> {user.email}</p>
                <div className="user-actions">
                  <button
                    id='admin-edit-user-btn'
                    className="btn-edit"
                    onClick={() => openUpdateModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    id='admin-edit-user-btn'
                    className="btn-delete"
                    onClick={() => deleteUser(user.email)}
                  >
                    Delete
                  </button>
                  <a
                    href={`/ordersUserAdmin?id=${user?._id}`}
                    id='admin-edit-user-btn'
                    className="btn-view"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/ordersUserAdmin?id=${user?._id}`;
                    }}
                  >
                    View Orders
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button type="button" className="close-button" onClick={closeModal}>
              x
            </button>
            <div className="modal-content">
              <h2>{isUpdateMode ? 'Edit User' : 'Add User'}</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                    required
                  />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                  />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    disabled={isUpdateMode}
                    required
                  />
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                  <div className="admin-toggle">
                    <label>
                      Admin
                      <input
                        type="checkbox"
                        name="isAdmin"
                        checked={formData.isAdmin}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-submit">
                    {isUpdateMode ? 'Save Changes' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserAdmin;
