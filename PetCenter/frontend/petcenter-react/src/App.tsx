import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './pages/Homepage'
import NavbarComp from './components/NavbarComp'
import FooterComp from './components/FooterComp'
import Create from './pages/Create'

function App() {

  return (
    <>
      <BrowserRouter>
        <NavbarComp />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/create' element={<Create />} />
          </Routes>
        <FooterComp />
      </BrowserRouter>
    </>
  )
}

export default App
