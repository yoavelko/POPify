import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes, Outlet } from "react-router-dom";
import Homepage from './components/homepage/Homepage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div id='app-container'>
      <Routes>
          <Route path='/' element={<><Header /><Outlet /><Footer/></>}>
            <Route index element={<Homepage />} />
          </Route>
      </Routes>
    </div>
  )
}

export default App
