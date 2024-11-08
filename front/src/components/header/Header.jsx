import './Header.css';
import logo from '../../media/POPL.png';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useCart } from '../cartIcon';
import { useWishlist } from '../heartIcon'; // ייבוא WishlistContext
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Login from '../login/Login';

const Navbar = () => {
  const { updateQuery, query, user, isAdmin, logout, products } = useUser();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const { wishlistItemCount } = useWishlist(); // שימוש ב-WishlistContext
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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

  const handleInputChange = (event) => {
    const value = event.target.value;
    updateQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handleProductClick = (name) => {
    updateQuery(name);
    setShowSearchResults(false);
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
            {user && isAdmin && (
              <li><Link to="/Admin">Admin</Link></li>
            )}
            <li><a href="#">Pop! Yourself</a></li>
          </ul>
        </div>

        <div className="right">
          <input
            id="search-query"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
          />

          {showSearchResults && (
            <aside className="search-results">
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
            </aside>
          )}

          <div className="icon-group">
            <Link to="/CheckOut" className='header__link'>
              <div className='header__optionBasket'>
                <span className='header__optionLineTwo header__basketCount'>{cartItemCount}</span>
              </div>
            </Link>
            <PiShoppingCartSimpleBold size={24} className='user-icon' />

            {/* קישור ל-Wishlist */}
            <div className='header__wishlist'>
              <Link to="/wishlist" className='header__link'> {/* נתיב לדף ה-Wishlist */}
                <GoHeart size={24} className='user-icon' />
                <span className='header__optionLineTwo header__wishlistCount'>{wishlistItemCount}</span>
              </Link>
            </div>

            <CgProfile size={24} className='user-icon' onClick={user ? toggleMenu : openLoginModal} />
          </div>

          {isLoginModalOpen && <Login closeLoginModal={closeLoginModal} />}

          {isSubMenuOpen && user && (
            <aside className="profile-menu">
              <ul>
                <li>Update Details</li>
                <li>Order History</li>
                <li onClick={logout}>Logout</li>
              </ul>
            </aside>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
