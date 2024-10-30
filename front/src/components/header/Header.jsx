import './Header.css';
import logo from '../../media/POPL.png';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useCart } from '../cartIcon';
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Login from '../login/Login';

const Navbar = () => {
  const { updateQuery, query, user, logout, products } = useUser();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // מצב פתיחת טופס עדכון
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
    setIsSubMenuOpen(false); // סגירת תפריט משנה
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    updateQuery(value);
    setShowSearchResults(value.length > 0); // הצגת תוצאות החיפוש רק אם יש טקסט
  };

  const handleProductClick = (name) => {
    updateQuery(name); // עדכון השאילתה בשם המוצר שנבחר
    setShowSearchResults(false); // סגירת חלונית תוצאות החיפוש
    navigate('/homepage'); 
  };

  const filteredProducts = products.filter(item =>
    item.name && item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <nav>
      <div className="menu">
        <div className="left">
          <Link to='/'>
            <div className="logo">
              <img src={logo} alt="Funko Logo" />
            </div>
          </Link>
          <ul>
            <li><Link to="/homepage">Products</Link></li>
            <li><Link to="/Admin">Admin</Link></li>
            <li><a href="#">Pop! Yourself</a></li>
          </ul>
        </div>

        <div className="right">
          <input
            id="search-query"
            type="text"
            placeholder="Search..."
            value={query} // הצגת השאילתה בשדה החיפוש
            onChange={handleInputChange}
          />

          {/* חלונית תוצאות חיפוש */}
          {showSearchResults && (
            <div className="search-results">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleProductClick(item.name)}
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <p className="no-results">No products found.</p>
              )}
            </div>
          )}

          <div className="icon-group">
            <Link to="/CheckOut" className='header__link'>
              <div className='header__optionBasket'>
                <span className='header__optionLineTwo header__basketCount'>{cartItemCount}</span>
              </div>
            </Link>
            <PiShoppingCartSimpleBold size={24} className='user-icon' />
            <GoHeart size={24} className='user-icon' />
            <CgProfile size={24} className='user-icon' onClick={user ? toggleMenu : openLoginModal} />
          </div>

          {/* מודאל התחברות */}
          {isLoginModalOpen && <Login closeLoginModal={closeLoginModal} />}

          {/* מודאל עדכון פרטים */}
          {isUpdateModalOpen && <Login closeLoginModal={closeUpdateModal} isUpdateMode={true} />}

          {/* תפריט פרופיל */}
          {isSubMenuOpen && user && (
            <div className="profile-menu">
              <ul>
                <li onClick={openUpdateModal}>Update Details</li>
                <li>Order History</li>
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
