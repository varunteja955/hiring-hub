import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Building2, Briefcase, DollarSign, MapPin, Trash2 } from 'lucide-react'
import { useAuth } from '../App'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs/`)
      setJobs(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const authToken = token || localStorage.getItem('token');
      await axios.delete(`${API_URL}/jobs/${jobId}/`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      // Remove the job from UI immediately
      setJobs(jobs.filter(job => job.id !== jobId));
      alert("Job deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Unable to delete job.");
    }
  }

  if (loading) return <div className="pt-24 text-center">Loading jobs...</div>

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Available Jobs</h1>

        {jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div
                layout
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 relative group border border-gray-800"
              >
                {/* --- DELETE BUTTON ADDED HERE --- */}
                {(user?.role === 'company' || user?.is_staff) && (
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Building2 className="text-blue-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-blue-400">{job.company_name}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {job.job_type}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> ${job.salary_min} - ${job.salary_max}
                  </div>
                </div>

                <Link to={`/jobs/${job.id}`} className="btn-secondary w-full text-center block py-2">
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}