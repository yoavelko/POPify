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
            <li><Link to="/homepage">Products</Link></li> {/* ניווט ל-Homepage */}
            <li><Link to="/">Home</Link></li> {/* ניווט לגלריה */}
            <li><a href="#">Featured</a></li>
            <li><a href="#">Pop! Yourself</a></li>
          </ul>
        </div>
        
        <div className="right">
         <li><Cart/></li>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
