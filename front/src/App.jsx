import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Slider from './components/Gallery/Slider'; // גלריה
import Navbar from './components/header/Header'; // התפריט שלך
import Footer from './components/footer/Footer';
import LogIn from './components/login/Login';
import Checkout from './components/CheckOut/checkOut';
import { CartProvider } from './components/cartIcon';
import { UserProvider } from './context/UserContext'; // ייבוא ה-UserProvider

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Slider />} /> {/* הגלריה כדף ראשי */}
          <Route path='/homepage' element={<Homepage />} /> {/* דף הבית בנתיב Products */}
          <Route path='/login' element={<LogIn />} />
          <Route path='/CheckOut' element={<Checkout />} />
        </Routes>
        <Footer />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
