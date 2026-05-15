import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../App'
import { Mail, Lock, User, Building2, Eye, EyeOff } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Signup() {
  const [userType, setUserType] = useState(null)
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
    first_name: '', 
    last_name: '',
    company_name: '', 
    company_role: 'HR', 
    company_size: '1-10'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) return alert("Please select an account type");
    
    setLoading(true);
    
    // Constructing payload to match common Django Rest Framework expectations
    const payload = {
      email: formData.email,
      password: formData.password,
      user_type: userType,
      // For students, send names; for companies, send company details
      ...(userType === 'student' 
        ? { first_name: formData.first_name, last_name: formData.last_name }
        : { 
            company_name: formData.company_name, 
            company_role: formData.company_role,
            company_size: formData.company_size,
            first_name: formData.company_name, // Fallback for name fields
            last_name: 'Company'
          }
      )
    };

    try {
      // Note the trailing slash at the end of /signup/ - Django is strict about this
      const res = await axios.post(`${API_URL}/auth/signup/`, payload);
      
      // Successfully signed up
      login(res.data.user, res.data.token);
      navigate(userType === 'company' ? '/company-dashboard' : '/student-dashboard');
    } catch (err) {
      // Detailed error reporting
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const serverError = err.response.data;
        const errorMsg = typeof serverError === 'object' 
          ? Object.entries(serverError).map(([k, v]) => `${k}: ${v}`).join('\n')
          : serverError;
        alert(errorMsg || "Signup failed");
      } else if (err.request) {
        // The request was made but no response was received
        alert("Network Error: Backend is not responding. Ensure your Django server is running at http://127.0.0.1:8000");
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
    try {
        const signupUrl = `${import.meta.env.VITE_API_URL}/auth/signup/`;
        console.log("SENDING REQUEST TO:", signupUrl);
        
        // This 'await' only works if the function above has 'async'
        const response = await axios.post(signupUrl, payload); 
        
        // ... handle success ...
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-[#0a0a0a] text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join the AI hiring revolution</p>
        </div>

        {/* User Type Selection */}
        <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setUserType('student')}
            className={`flex-1 py-3 rounded-lg transition-all flex flex-col items-center ${userType === 'student' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-sm font-medium">Job Seeker</span>
          </button>
          
          <button
            type="button"
            onClick={() => setUserType('company')}
            className={`flex-1 py-3 rounded-lg transition-all flex flex-col items-center ${userType === 'company' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            <Building2 className="w-5 h-5 mb-1" />
            <span className="text-sm font-medium">Company</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!userType ? (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
              Select an account type to begin.
            </div>
          ) : (
            <>
              {userType === 'student' ? (
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="First Name" type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" required />
                  <input placeholder="Last Name" type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" required />
                </div>
              ) : (
                <div className="space-y-4">
                  <input placeholder="Company Name" type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2" required />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={formData.company_role} onChange={(e) => setFormData({...formData, company_role: e.target.value})} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                      <option value="HR">HR</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Manager">Manager</option>
                    </select>
                    <select value={formData.company_size} onChange={(e) => setFormData({...formData, company_size: e.target.value})} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="50+">50+</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input placeholder="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2" required />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input placeholder="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-2" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-colors disabled:opacity-50">
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </>
          )}
        </form>
        
        <p className="text-center mt-6 text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}