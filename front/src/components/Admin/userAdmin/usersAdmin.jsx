// src/components/Admin/usersAdmin.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './usersAdmin.css'; // Ensure you have appropriate styles
import { getUsers } from '../../../utils/AdminRoutes';
import Maps from './Maps/Maps';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const UserAdmin = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [marked, setMarked] = useState(null);

  isModalOpen ? disableBodyScroll(document) : enableBodyScroll(document)

  useEffect(() => {
    getAllUsers();
  }, []);
  // Function to fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get(getUsers);
      setUsers(response.data.users);

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Form state for add/update
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adress: '',
    admin: false,
    delete: false,
  });

  // Function to display messages
  const createMessage = (text, isError = false) => {
    setMessage({ text, isError });
    // Automatically hide the message after 5 seconds
    setTimeout(() => {
      setMessage({ text: '', isError: false });
    }, 5000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Open modal for adding a new user
  const openAddModal = () => {
    setIsUpdateMode(false);
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      admin: false,
      marketing: false,
    });
    setIsModalOpen(true);
  };

  // Open modal for updating an existing user
  const openUpdateModal = (user) => {
    setIsUpdateMode(true);
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Leave password empty for security
      admin: user.admin || false,
      marketing: user.marketing || false,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      admin: false,
      marketing: false,
    });
  };

  // Handle form submission for add/update
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      createMessage('Please fill in all required fields.', true);
      return;
    }

    if (isUpdateMode && formData.password) {
      const regex = /[!@#$%^&*(),.?":{}|<>]/;
      if (formData.password.length < 6 || !regex.test(formData.password)) {
        createMessage('Password must be at least 6 characters long and contain one special character.', true);
        return;
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      createMessage('Please enter a valid email address.', true);
      return;
    }

    if (isUpdateMode) {
      const confirmation = window.confirm('Are you sure you want to update this user?');
      if (!confirmation) return;
      await updateUser();
    } else {
      const confirmation = window.confirm('Are you sure you want to add this user?');
      if (!confirmation) return;
      await addUser();
    }
  };

  // Function to update a user
  const updateUser = async () => {
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password; // Don't send password if not updating
      }

      const response = await fetch('/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedData,
          email: selectedUser.email,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        createMessage(result.message, false);
        closeModal();
        getAllUsers();
      } else {
        setMessage({ text: result.message || 'Failed to update the user.', isError: true });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      createMessage('An error occurred while updating the user.', true);
    }
  };

  // Function to add a new user
  const addUser = async () => {
    try {
      const response = await fetch('/addUser', { // Ensure your backend has this endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        createMessage(result.message, false);
        closeModal();
        getAllUsers();
      } else {
        setMessage({ text: result.message || 'Failed to add the user.', isError: true });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      createMessage('An error occurred while adding the user.', true);
    }
  };

  // Function to find a user by email
  const findUser = async () => {
    if (!email) {
      createMessage('Please enter an email to search.', true);
      return;
    }

    try {
      const response = await fetch('/find-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: email }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.user) {
          setUsers([result.user]);
          createMessage('User found.', false);
        } else {
          createMessage('No user found with the provided email.', true);
        }
      } else {
        setMessage({ text: result.message || 'Failed to find the user.', isError: true });
      }
      setEmail('');
    } catch (error) {
      console.error('Error fetching user:', error);
      createMessage('An error occurred while fetching the user.', true);
    }
  };

  // Function to delete a user
  const deleteUser = async (userEmail) => {
    const confirmation = window.confirm('Are you sure you want to delete this user?');
    if (!confirmation) return;

    try {
      const response = await fetch('/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        createMessage(result.message, false);
        getAllUsers();
      } else {
        setMessage({ text: result.message || 'Failed to delete the user.', isError: true });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      createMessage('Failed to delete the user, please try again later.', true);
    }
  };

  return (
    <div className="user-admin-container">
      <h1>User Administration</h1>

      {/* Search Form */}
      <form onSubmit={(e) => { e.preventDefault(); findUser(); }} className="search-form">
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Find</button>
        <button type="button" onClick={getAllUsers}>Show All Users</button>
        <button type="button" onClick={openAddModal}>Add New User</button>
      </form>

      <div className='maps-container'>
        <Maps
          users={users}
          setMarked={setMarked} />
        <div className='marked-space-holder'>
          {
            marked && (
              <div className="user-box" key={marked.email} style={{ transform: 'scale(1.2)' }}>
                <div className="name-box">
                  <p className='marked-name-close-flexer'>
                    <div>
                      <span>{marked.name}</span> <span>{marked.lastName}</span>
                    </div>
                    <button className='marked-close' onClick={() => setMarked(null)}>X</button>
                  </p>
                </div>
                <p><strong>Email:</strong><br />{marked.email}</p>
                <p><strong>Admin:</strong> <span>{marked.admin ? 'Yes' : 'No'}</span></p>
                <p><strong>Deleted:</strong> <span>{marked.delete ? 'Yes' : 'No'}</span></p>
                <div className="user-actions">
                  <button onClick={() => openUpdateModal(marked)}>Update User</button>
                  <button onClick={() => deleteUser(marked.email)}>Delete User</button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.setItem('userFullName', `${marked.firstName} ${marked.lastName}`);
                      localStorage.setItem('userId', user._id);
                      window.location.href = '/ordersUserAdmin';
                    }}
                  >
                    Orders
                  </a>
                </div>
              </div>
            )
          }
        </div>
        <div></div>
      </div>

      {/* Users List */}
      <div className="users-container">
        {users && users.map((user) => (
          <div className="user-box" key={user.email}>
            <div className="name-box">
              <p>
                <span>{user.name}</span> <span>{user.lastName}</span>
              </p>
            </div>
            <p><strong>Email:</strong><br />{user.email}</p>
            <p><strong>Admin:</strong> <span>{user.admin ? 'Yes' : 'No'}</span></p>
            <p><strong>Deleted:</strong> <span>{user.delete ? 'Yes' : 'No'}</span></p>
            <div className="user-actions">
              <button onClick={() => openUpdateModal(user)}>Update User</button>
              <button onClick={() => deleteUser(user.email)}>Delete User</button>
              <a
                href={`/ordersUserAdmin?id=${user?._id}`} // העברת ה-ID דרך ה-URL
                onClick={(e) => {
                  e.preventDefault();
                  console.log("user id is ", user?._id); // הדפסת ה-ID לקונסול
                  window.location.href = `/ordersUserAdmin?id=${user?._id}`; // הפניה עם ID בפרמטר
                }}
              >
                Orders
              </a>

            </div>
          </div>
        ))
        }
      </div>

      {/* Modal for Add/Update User */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 id="modalTitle">{isUpdateMode ? 'Update User' : 'Add User'}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isUpdateMode} // Disable email edit during update
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isUpdateMode ? 'Leave blank to keep unchanged' : 'Enter password'}
                  required={!isUpdateMode} // Required for adding a new user
                />
              </label>
              <label>
                Admin:
                <input
                  type="checkbox"
                  name="admin"
                  checked={formData.admin}
                  onChange={handleInputChange}
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Close</button>
                <button type="submit">{isUpdateMode ? 'Update User' : 'Add User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;
