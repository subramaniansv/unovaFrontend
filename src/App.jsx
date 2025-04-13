import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Service from './pages/Service'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <>
    <div className=" min-h-screen">
    <Router>
    
    <Navbar/>

    <ScrollToTop/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/service' element={<Service/>}/>
      <Route path='/portfolio' element={<Portfolio/>}/>
      <Route path='/contact' element={<Contact/>}/>
    </Routes>
    
    </Router>
    </div>
    </>
  )
}

export default App
