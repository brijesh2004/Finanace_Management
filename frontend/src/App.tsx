import './App.css'
import { BrowserRouter as Router
  , Routes,
  Route
} from 'react-router-dom'
import Register from './pages/Register'
import Navbar from './pages/Navbar'
import Login from './pages/Login'
import Home from './pages/Home'
import About from './pages/About'
import AddIncome from './pages/AddIncome'
import ResetPassword from './pages/ResetPassword'

function App() {
  

  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/add' element={<AddIncome/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/resetpassword' element={<ResetPassword/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
