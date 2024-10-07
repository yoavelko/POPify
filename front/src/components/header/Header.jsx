import './Header.css';
import logo from '../../media/POPL.png';
import { Link } from 'react-router-dom';
import Cart from '../../media/carticon.svg';

const Navbar = () => {
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
            <li><Link to="/login">log in</Link></li>
            <li><a href="#">Pop! Yourself</a></li>
          </ul>
        </div>
        
        <div className="right">
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
