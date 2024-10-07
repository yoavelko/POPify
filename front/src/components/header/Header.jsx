import './Header.css';
import logo from '../../media/POPL.png';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


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
        <Link to="/CheckOut" className='header__link'>
        <div className='header__optionBasket'>
        <ShoppingCartIcon/>
        {/*number of items in the basket*/}
        <span className='header__optionLineTwo header__basketCount'>2</span>
        </div>
        </Link>
        
        <div class="heart icon"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
