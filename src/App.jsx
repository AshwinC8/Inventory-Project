import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/loginPage'
import Success from './pages/successPage'
import HeaderBar from './components/shared layout/HeaderBar'
import History from './pages/historyPage'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ <Login/> } />
          <Route path='/Dashboard' element={ <Success/> } />
          <Route path='/History' element={ <History/> } />
        </Routes>
      </Router>
    </>
  )
}

export default App
