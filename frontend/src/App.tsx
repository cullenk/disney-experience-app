import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login } from './components/Auth/Login'
import { Dashboard } from './components/Dashboard/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-disney-dark text-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
