import './App.css'
import { Route, Routes, Outlet } from "react-router-dom";
import Homepage from './components/homepage/Homepage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Login from './components/login/Login';



function App() {



  return (
    <div id='app-container'>
      <Routes>
        <Route path='/' element={<><Header /><Outlet /><Footer /></>}>
          <Route index element={<Homepage />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
