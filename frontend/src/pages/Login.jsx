import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../App'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const API_URL = import.meta.env.VITE_API_URL || 'https://hiring-hub.onrender.com';
// const API_URL = import.meta.env.VITE_API_URL;

console.log("Current API URL:", import.meta.env.VITE_API_URL);

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginPayload = {
        email: email,
        password: password
    };

    try {
        const response = await axios.post(`${API_URL}/api/auth/login/`, loginData);

        const data = await response.json();

          if (response.ok) {
                const userRole = data.user.role || 'student';
                const userData = {
                    email: data.user.email,
                    id: data.user.id,
                    role: userRole,
                    is_verified: data.user.is_verified
                };

                login(userData, data.token);

                if (userRole === 'company') {
                    navigate('/company-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            }
            else {
            alert(data.detail || data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Could not connect to backend server. Make sure it is running!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" placeholder="you@example.com" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12 pr-12" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}