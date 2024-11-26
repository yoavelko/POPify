import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Navbar from './components/header/Header';
import Footer from './components/footer/Footer';
import LogIn from './components/login/Login';
import Checkout from './components/CheckOut/checkOut';
import Admin from './components/Admin/admin';
import OrderHistory from './components/userOrders/Orders';
import ProductManagement from './components/Admin/productA/productA'; // Product Management Page
import { CartProvider } from './components/cartIcon';
import { WishlistProvider } from './components/heartIcon';
import { UserProvider } from './context/UserContext';
import MarketingPage from './components/Marketing/MarketingPage'; // Marketing Page
import ProtectedRoute from './context/ProtectedRoute'; 
import UserAdmin from './components/Admin/userAdmin/usersAdmin';
import Wish from './components/WishList/WishList';
import Contact from './components/Contact/Contact';
import { CurrencyProvider } from './context/CurrencyContext';
import Orders from './components/Admin/orders/Orders';

function App() {
  return (
    <CurrencyProvider>
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<OrderHistory />} />
          {/* Protected Pages */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <ProtectedRoute>
                <UserAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/orders'
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
           path="/ordersUserAdmin"
           element={
           <OrderHistory userIdFromAdmin={localStorage.getItem('userId')} />} />

        </Routes>
        <Footer />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
    </CurrencyProvider>
  );
}

export default App;
