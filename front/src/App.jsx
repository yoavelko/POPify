import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Navbar from './components/header/Header';
import Footer from './components/footer/Footer';
import LogIn from './components/login/Login';
import Checkout from './components/CheckOut/checkOut';
import Admin from './components/Admin/admin';
import ProductManagement from './components/Admin/productA'; // Product Management Page
import { CartProvider } from './components/cartIcon';
import { WishlistProvider } from './components/heartIcon';
import { UserProvider } from './context/UserContext';
import MarketingPage from './components/Marketing/MarketingPage'; // Marketing Page
import ProtectedRoute from './context/ProtectedRoute'; 
import UserAdmin from './components/Admin/usersAdmin'; // Corrected Import
import Wish from './components/WishList/WishList';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
        <Navbar />
        <Routes>
          {/* Public Pages */}
          <Route path='/' element={<MarketingPage />} /> 
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/CheckOut' element={<Checkout />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/WishList" element={<Wish />} />
          {/* Protected Pages */}
          <Route
            path='/Admin'
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path='/productA'
            element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='/usersAdmin'
            element={
              <ProtectedRoute>
                <UserAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
