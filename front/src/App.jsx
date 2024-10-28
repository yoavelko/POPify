import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Slider from './components/Gallery/Slider';
import Navbar from './components/header/Header';
import Footer from './components/footer/Footer';
import LogIn from './components/login/Login';
import Checkout from './components/CheckOut/checkOut';
import Admin from './components/Admin/admin';
import ProductManagement from './components/Admin/productA'; // ייבוא דף ניהול מוצרים
import { CartProvider } from './components/cartIcon';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Slider />} /> 
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/CheckOut' element={<Checkout />} />
          <Route path='/Admin' element={<Admin />} />
          <Route path='/productA' element={<ProductManagement />} /> {/* דף ניהול מוצרים */}
        </Routes>
        <Footer />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
