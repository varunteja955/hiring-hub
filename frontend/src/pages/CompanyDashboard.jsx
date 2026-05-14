import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../App'
import { Building2, Users, Briefcase, Plus, TrendingUp, CheckCircle, Clock, X, Download, Calendar } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media'

export default function CompanyDashboard() {
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [allApplications, setAllApplications] = useState([])
  const [recentApplicants, setRecentApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token } = useAuth()
  const [showPostJob, setShowPostJob] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [skillInput, setSkillInput] = useState('')
  const [newJob, setNewJob] = useState({
    title: '', description: '', required_skills: [], location: '',
    salary_min: '', salary_max: '', job_type: 'Full-time', work_mode: 'On-site'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/auth/profile/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/jobs/my/`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setProfile(profileRes.data)
      setJobs(jobsRes.data)

      let allApps = []
      for (const job of jobsRes.data) {
        try {
          const apps = await axios.get(`${API_URL}/resume/job/${job.id}/applications/`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          allApps = [...allApps, ...apps.data.map(app => ({ ...app, job_title: job.title }))]
        } catch (e) {}
      }
      setAllApplications(allApps)
      setRecentApplicants(allApps.slice(0, 10))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const getResumeUrl = (resumePath) => {
    if (!resumePath) return null
    // If it's already a full URL, return as-is
    if (resumePath.startsWith('http')) return resumePath
    // Get just the filename from the path
    const filename = resumePath.split('/').pop()
    // Always use absolute URL to media folder
    return `http://localhost:8000/media/applications/resumes/${filename}`
  }

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (skillInput.trim() && !newJob.required_skills.includes(skillInput.trim())) {
        setNewJob({
          ...newJob,
          required_skills: [...newJob.required_skills, skillInput.trim()]
        });
        setSkillInput('');
      }
    }
  }

  const removeSkill = (skillToRemove) => {
    setNewJob({
      ...newJob,
      required_skills: newJob.required_skills.filter(s => s !== skillToRemove)
    });
  }

  const postJob = async (e) => {
    e.preventDefault()
    try {
      const data = { ...newJob, salary_min: Number(newJob.salary_min), salary_max: Number(newJob.salary_max) }
      await axios.post(`${API_URL}/jobs/`, data, { headers: { Authorization: `Bearer ${token}` } })
      setShowPostJob(false)
      setNewJob({ title: '', description: '', required_skills: [], location: '', salary_min: '', salary_max: '', job_type: 'Full-time', work_mode: 'On-site' })
      loadData()
    } catch (err) {
      alert('Failed to post job')
    }
  }

  const updateStatus = async (appId, status) => {
    if (!appId) return alert('Invalid Application ID')
    try {
      await axios.post(
        `${API_URL}/resume/${appId}/update/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      loadData()
    } catch (err) {
      alert('Failed to update')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-500/20 text-green-400'
      case 'rejected': return 'bg-red-500/20 text-red-400'
      case 'interview': return 'bg-cyan-500/20 text-cyan-400'
      case 'hired': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-yellow-500/20 text-yellow-400'
    }
  }

  const hiredCount = allApplications.filter(a => a.status === 'hired').length
  const interviewCount = allApplications.filter(a => a.status === 'interview').length
  const shortlistedCount = allApplications.filter(a => a.status === 'shortlisted').length

  if (loading) return <div className="pt-24 text-center">Loading...</div>

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{profile?.company_name}</h1>
            <p className="text-gray-500">Manage your hiring</p>
          </div>
          <button onClick={() => setShowPostJob(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Active Jobs', value: jobs.filter(j => j.is_active).length, icon: Briefcase, color: 'blue' },
            { label: 'Total Applications', value: allApplications.length, icon: Users, color: 'cyan' },
            { label: 'Shortlisted', value: shortlistedCount, icon: CheckCircle, color: 'green' },
            { label: 'Interview', value: interviewCount, icon: Calendar, color: 'yellow' },
            { label: 'Hired', value: hiredCount, icon: CheckCircle, color: 'purple' },
          ].map((stat, i) => (
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
              <h2 className="text-xl font-semibold mb-4">Your Job Postings</h2>
              {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs posted yet.</p>
              ) : (
                <div className="space-y-3">
                  {jobs.map(job => {
                    const jobApps = allApplications.filter(a => a.job_id === job.id)
                    return (
                      <div key={job.id} className="p-4 bg-dark-bg rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{job.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${job.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {job.is_active ? 'Active' : 'Closed'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{job.location} • {jobApps.length} applicants</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Applicants</h2>
              <div className="space-y-3">
                {recentApplicants.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No recent applicants found.</p>
                ) : (
                  recentApplicants.map((app) => (
                    <div key={app.id} className="p-3 bg-dark-bg rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{app.candidate_name || 'Applicant'}</span>
                        <span className="text-blue-400">{app.ats_score || app.match_score || 0}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{app.job_title || 'Application'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {app.resume && (
                          <a
                            href={getResumeUrl(app.resume)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Resume
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => updateStatus(app.id, 'shortlisted')}
                          disabled={app.status === 'shortlisted' || app.status === 'hired'}
                          className={`text-xs px-2 py-1 rounded ${app.status === 'shortlisted' || app.status === 'hired' ? 'text-gray-500 cursor-not-allowed' : 'text-green-400 hover:bg-green-500/20 hover:underline'}`}
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'rejected')}
                          disabled={app.status === 'rejected' || app.status === 'hired'}
                          className={`text-xs px-2 py-1 rounded ${app.status === 'rejected' || app.status === 'hired' ? 'text-gray-500 cursor-not-allowed' : 'text-red-400 hover:bg-red-500/20 hover:underline'}`}
                        >
                          Reject
                        </button>
                        {app.status === 'shortlisted' && (
                          <button
                            onClick={() => updateStatus(app.id, 'interview')}
                            className="text-xs px-2 py-1 rounded text-yellow-400 hover:bg-yellow-500/20 hover:underline"
                          >
                            Interview
                          </button>
                        )}
                        {app.status === 'interview' && (
                          <button
                            onClick={() => updateStatus(app.id, 'hired')}
                            className="text-xs px-2 py-1 rounded text-purple-400 hover:bg-purple-500/20 hover:underline"
                          >
                            Hire
                          </button>
                        )}
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {showPostJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-dark-card rounded-2xl p-6 max-w-lg w-full overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-4">Post New Job</h2>
              <form onSubmit={postJob} className="space-y-4">
                <input type="text" placeholder="Job Title" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="input-field" required />
                <textarea placeholder="Job Description" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="input-field" rows={4} required />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Required Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                      className="input-field flex-1"
                    />
                    <button type="button" onClick={handleAddSkill} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newJob.required_skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg flex items-center gap-2">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400"><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                </div>

                <input type="text" placeholder="Location" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="input-field" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Min Salary" value={newJob.salary_min} onChange={e => setNewJob({...newJob, salary_min: e.target.value})} className="input-field" />
                  <input type="number" placeholder="Max Salary" value={newJob.salary_max} onChange={e => setNewJob({...newJob, salary_max: e.target.value})} className="input-field" />
                </div>
                <select value={newJob.job_type} onChange={e => setNewJob({...newJob, job_type: e.target.value})} className="input-field">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowPostJob(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Post Job</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}