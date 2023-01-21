import { useState } from 'react'
import './App.css'

import Main from './components/Main'
import SideNav from './components/SideBar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>  
          <Route exact path='/' element={< LandingPage />}></Route>  
          <Route exact path='/login' element={< LoginPage />}></Route>  
          <Route exact path='/signup' element={< SignUpPage />}></Route>  
        </Routes>  
      </BrowserRouter>
    </div>
  )
}

export default App;
