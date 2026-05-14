import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../App'
import { CheckCircle, Users, Briefcase, Download, Mail, Phone, Calendar } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media'

const getResumeUrl = (resumePath) => {
  if (!resumePath) return null
  if (resumePath.startsWith('http')) return resumePath
  const filename = resumePath.split('/').pop()
  return `http://localhost:8000/media/applications/resumes/${filename}`
}

export default function Hired() {
  const [hiredCandidates, setHiredCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()

  useEffect(() => {
    loadHiredCandidates()
  }, [])

  const loadHiredCandidates = async () => {
    try {
      const jobsRes = await axios.get(`${API_URL}/jobs/my/`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      let allHired = []
      for (const job of jobsRes.data) {
        const appsRes = await axios.get(`${API_URL}/resume/job/${job.id}/applications/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const hired = appsRes.data.filter(app => app.status === 'hired')
        allHired = [...allHired, ...hired.map(app => ({ ...app, job_title: job.title }))]
      }
      setHiredCandidates(allHired)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (loading) return <div className="pt-24 text-center">Loading...</div>

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            Hired Candidates
          </h1>
          <p className="text-gray-500">Candidates who have been hired through your company</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <Users className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-3xl font-bold">{hiredCandidates.length}</div>
            <div className="text-gray-500">Total Hired</div>
          </motion.div>
        </div>

        {hiredCandidates.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hired Candidates Yet</h3>
            <p className="text-gray-500">Candidates you hire will appear here.</p>
            <Link to="/company-dashboard" className="btn-primary inline-block mt-4">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-green-400">
                      {candidate.candidate_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{candidate.candidate_name || 'Applicant'}</h3>
                    <p className="text-sm text-gray-500">{candidate.job_title}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Match Score: {candidate.match_score}%</span>
                  </div>
                  {candidate.resume && (
                    <a
                      href={getResumeUrl(candidate.resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume</span>
                    </a>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                    Hired
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}