import './Header.css';
import logo from '../../media/POPL.png';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { useCart } from '../cartIcon';
import { RiProfileLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { IoBagCheckOutline } from "react-icons/io5";
import React, { useEffect, useState } from 'react';
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { GoHeart } from "react-icons/go";
import { useUser } from '../../context/UserContext'

const Navbar = ({ setQuery }) => {
  const { updateQuery } = useUser();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const [user, setUser] = useState(null);

  const toggleMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Adjust if the token is stored elsewhere
    alert('You have been logged out successfully.');
    window.location.href = '/login'; // Redirect to the login page or homepage
};

  // בדיקת סטטוס המשתמש ב-useEffect
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
            <li><Link to="/Admin">admin</Link></li>
            {!user && <li><Link to="/login">Log In</Link></li>}
            <li><a href="#">Pop! Yourself</a></li>
          </ul>
        </div>

        <div className="right">
          {/* שדה החיפוש */}
          <input
            id="search-query"
            type="text"
            placeholder="Search..."
            onChange={(event) => updateQuery(event.target.value)} // העברת מילות החיפוש
          />
          <Link to="/CheckOut" className='header__link'>
            <div className='header__optionBasket'>
              <span className='header__optionLineTwo header__basketCount'>{cartItemCount}</span>
            </div>
          </Link>
          <PiShoppingCartSimpleBold size={20} className='user-icon' />
          <GoHeart className='user-icon' />
          <CgProfile className='user-icon' onClick={toggleMenu} />

          {/* תפריט משנה מותאם לפי סטטוס המשתמש */}
          <div className={`sub-menu-wrap-pro ${isSubMenuOpen ? 'open' : 'closed'}`} id='subMenu'>
            <div className='sub-menu-pro'>
              <div className='user-info'>
                <CgProfile className='form-icon' />
                {user ? (
                  <>
                    <h3>{user.name} {user.lastName}</h3>
                    <hr/>
                    <Link className='sub-menu-link'>
                      <RiProfileLine />
                      <p>Edit Profile</p>
                      <span> - </span>
                    </Link>
                    <Link className='sub-menu-link'>
                      <IoBagCheckOutline />
                      <p>Order History</p>
                      <span> - </span>
                    </Link>
                    <Link className='sub-menu-link'>
                      <CiLogout onClick={handleLogout}/>
                      <p>Log-Out</p>
                      <span> - </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <p>Guest User</p>
                    <hr />
                    <Link className='sub-menu-link'>
                      <CiLogout />
                      <p>Log-in</p>
                      <span> - </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
