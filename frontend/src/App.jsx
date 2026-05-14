import { useState, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Hired from './pages/Hired'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (userData, token) => {
    setUser(userData)
    setToken(token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-dark-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route
              path="/student-dashboard"
              element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/company-dashboard"
              element={user?.role === 'company' ? <CompanyDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/hired"
              element={user?.role === 'company' ? <Hired /> : <Navigate to="/login" />}
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;