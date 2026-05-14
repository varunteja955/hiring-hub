import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../App'
import { User, FileText, Briefcase, CheckCircle, Clock, AlertCircle, TrendingUp, Upload, Sparkles, Target } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) return;

    try {
      const [profileRes, appsRes] = await Promise.all([
        axios.get(`${API_URL}/auth/profile/`, { headers: { Authorization: `Bearer ${authToken}` } }),
        axios.get(`${API_URL}/resume/my-applications/`, { headers: { Authorization: `Bearer ${authToken}` } })
      ]);
      setProfile(profileRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data);
    }
    setLoading(false)
  }

  const uploadResume = async (e, jobId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    if (jobId) {
      formData.append('job', jobId);
    }

    try {
      const authToken = token || localStorage.getItem('token');

      const endpoint = jobId ? `${API_URL}/resume/upload/` : `${API_URL}/resume/analyze/`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!jobId) {
        setAnalysisResult(response.data);
      }

      alert(jobId ? 'Application successful!' : 'Resume analyzed successfully!');
      loadData();
    } catch (err) {
      console.error("Full Error Object:", err);
      const msg = err.response?.data?.error || "Upload failed. Check if Django is running.";
      alert(msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const stats = [
    { label: 'Applications', value: applications.length, icon: Briefcase, color: 'blue' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, icon: CheckCircle, color: 'green' },
    { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'yellow' },
    { label: 'Interview', value: applications.filter(a => a.status === 'interview').length, icon: TrendingUp, color: 'cyan' },
  ]

  const resumeScore = profile?.resume_score || analysisResult?.ats_score || analysisResult?.score || 0

  if (loading) return <div className="pt-24 text-center">Loading...</div>

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {profile?.first_name}!</h1>
          <p className="text-gray-500">Track your job applications and AI recommendations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <stat.icon className={`w-8 h-8 text-${stat.color}-500 mb-2`} />
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">My Applications</h2>
              {applications.length === 0 ? (
                <p className="text-gray-500">No applications yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 bg-dark-bg rounded-xl flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{app.job_title}</h3>
                        <p className="text-sm text-gray-500">{app.company_name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm ${app.status === 'shortlisted' ? 'bg-green-500/20 text-green-400' : app.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {app.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Match: {app.match_score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Profile Score</h2>
              <div className="text-center py-4">
                {resumeScore > 0 && (
                  <div className="mb-4">
                    <div className="relative w-32 h-32 mx-auto mb-2">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="12" fill="none" />
                        <circle
                          cx="64" cy="64" r="56"
                          stroke={resumeScore >= 70 ? '#10b981' : resumeScore >= 50 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(resumeScore / 100) * 352} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{resumeScore}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                      <Sparkles className="w-4 h-4" /> AI Resume Score
                    </p>
                  </div>
                )}
                <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Analyzing...' : 'Upload Resume'}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => uploadResume(e, null)} className="hidden" disabled={uploading} />
                </label>
                {uploading && (
                  <p className="text-sm text-gray-400 mt-2">Analyzing your resume...</p>
                )}
              </div>
            </div>

            {profile?.skills?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}