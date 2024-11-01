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
import MarketingPage from "./components/Marketing/MarketingPage"; // ייבוא עמוד השיווק
import ProtectedRoute from './context/ProtectedRoute'; 

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          {/* עמודים שאינם מוגנים */}
          <Route path='/' element={<MarketingPage />} /> 
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/CheckOut' element={<Checkout />} />
          <Route path="/marketing" element={<MarketingPage />} />

          {/* עמודים מוגנים בעזרת ProtectedRoute */}
          <Route path='/Admin'element={<ProtectedRoute><Admin />
              </ProtectedRoute>
            }
          />
          <Route path='/productA'element={<ProtectedRoute><ProductManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </CartProvider>
    </UserProvider>
  );
}

export default App;
