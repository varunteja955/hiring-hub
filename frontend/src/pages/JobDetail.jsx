import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../App'
import { MapPin, Briefcase, DollarSign, Clock, Send, Upload, ChevronLeft } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null) // Added state
  const { user, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/${id}/`)
      setJob(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const applyToJob = async () => {
    if (!selectedFile) {
      alert("Please select a resume file first.");
      return;
    }

    setApplying(true)
    const formData = new FormData()
    formData.append('resume', selectedFile) // File must be named 'resume'
    formData.append('job', id) // Sending Job ID

    try {
      const authToken = token || localStorage.getItem('token')
      await axios.post(`${API_URL}/resume/upload/`, formData, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data' 
        }
      })
      alert('Application submitted successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error(err.response?.data)
      alert(err.response?.data?.error || "Unable to apply. Check file format.");
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <div className="pt-24 text-center">Loading...</div>
  if (!job) return <div className="pt-24 text-center">Job not found</div>

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ChevronLeft className="w-5 h-5" /> Back to Jobs
        </button>

        <div className="card p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <p className="text-xl text-blue-400">{job.company_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-dark-bg rounded-xl border border-gray-800">
              <MapPin className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-sm text-gray-400">Location</p>
              <p className="font-medium">{job.location}</p>
            </div>
            <div className="p-4 bg-dark-bg rounded-xl border border-gray-800">
              <Briefcase className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-sm text-gray-400">Type</p>
              <p className="font-medium">{job.job_type}</p>
            </div>
            <div className="p-4 bg-dark-bg rounded-xl border border-gray-800">
              <DollarSign className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-sm text-gray-400">Salary</p>
              <p className="font-medium">${job.salary_min} - ${job.salary_max}</p>
            </div>
            <div className="p-4 bg-dark-bg rounded-xl border border-gray-800">
              <Clock className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-sm text-gray-400">Experience</p>
              <p className="font-medium">{job.experience_required} Level</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          {/* APPLICATION SECTION */}
          <div className="mt-8 p-6 bg-dark-bg rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Apply for this Position</h3>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Upload Resume (PDF/DOCX)</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
              />
            </div>

            <button
              onClick={applyToJob}
              disabled={applying || user?.role !== 'student' || !selectedFile}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              <Send className="w-5 h-5" />
              {applying ? 'Submitting Application...' : 'Submit Application'}
            </button>
            {user?.role !== 'student' && (
                <p className="text-center text-red-400 text-sm mt-2">Only student accounts can apply.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}