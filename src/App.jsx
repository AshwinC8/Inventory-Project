import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/loginPage'
import Success from './pages/successPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Login/> } />
        <Route path='/Dashboard' element={ <Success/> } />
      </Routes>
    </Router>
  )
}

export default App
