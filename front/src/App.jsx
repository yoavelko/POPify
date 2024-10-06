import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './components/homepage/Homepage';
import Slider from './components/Gallery/Slider'; // גלריה
import Navbar from './components/header/Header'; // התפריט שלך
import Footer from './components/footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Slider />} /> {/* הגלריה כדף ראשי */}
        <Route path='/homepage' element={<Homepage />} /> {/* דף הבית בנתיב Products */}
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
