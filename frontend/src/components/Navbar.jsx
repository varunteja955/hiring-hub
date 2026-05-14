import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import { Briefcase, User, LogOut, Menu, X, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">HireHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-300 hover:text-white transition">Jobs</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'student' ? '/student-dashboard' : '/company-dashboard'}
                  className="text-gray-300 hover:text-white transition"
                >
                  Dashboard
                </Link>
                {user.role === 'company' && (
                  <Link to="/hired" className="text-gray-300 hover:text-white transition flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Hired
                  </Link>
                )}
                <button onClick={logout} className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                <Link to="/signup" className="btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-dark-border">
          <div className="px-4 py-4 space-y-4">
            <Link to="/jobs" className="block text-gray-300">Jobs</Link>
            {user ? (
              <>
                <Link
                  to={user.role === 'student' ? '/student-dashboard' : '/company-dashboard'}
                  className="block text-gray-300"
                >
                  Dashboard
                </Link>
                {user.role === 'company' && (
                  <Link to="/hired" className="block text-gray-300 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Hired
                  </Link>
                )}
                <button onClick={logout} className="block text-gray-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300">Login</Link>
                <Link to="/signup" className="block btn-primary text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}