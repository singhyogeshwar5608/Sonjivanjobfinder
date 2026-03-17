import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, Plus, Edit, Trash2, Users, Briefcase, 
  Search, Filter, Download, X, Eye, Mail, FileText, Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { jobsAPI, applicationsAPI, pdfAPI } from '../services/api'
import ApplicantProfileCard from '../components/ApplicantProfileCard'

const AdminDashboard = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [viewJob, setViewJob] = useState(null)
  const [viewingResume, setViewingResume] = useState(null)
  const [applicantDocuments, setApplicantDocuments] = useState([])
  
  const [filters, setFilters] = useState({
    job_id: '',
    skills: '',
    profession: '',
    search: '',
  })

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    salary: '',
    education: '',
    education_duration: '',
    required_skills: '',
    about_company: '',
    description: '',
    requirements: '',
    status: 'active',
  })
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    fetchJobs()
    fetchApplications()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [applications, filters])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await jobsAPI.getAll()
      if (response.data.success) {
        setJobs(response.data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const response = await applicationsAPI.getAll()
      if (response.data.success) {
        setApplications(response.data.applications)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...applications]

    if (filters.job_id) {
      filtered = filtered.filter(app => app.job_id === parseInt(filters.job_id))
    }

    if (filters.skills) {
      filtered = filtered.filter(app => 
        app.skills?.toLowerCase().includes(filters.skills.toLowerCase())
      )
    }

    if (filters.profession) {
      filtered = filtered.filter(app => 
        app.profession?.toLowerCase().includes(filters.profession.toLowerCase())
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(app => 
        app.full_name?.toLowerCase().includes(searchLower) ||
        app.email?.toLowerCase().includes(searchLower) ||
        app.phone?.includes(searchLower)
      )
    }

    setFilteredApplications(filtered)
  }

  const handleJobFormChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleJobSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingJob) {
        await jobsAPI.update({ ...jobForm, id: editingJob.id })
      } else {
        await jobsAPI.create(jobForm)
      }
      
      setShowJobForm(false)
      setEditingJob(null)
      resetJobForm()
      fetchJobs()
    } catch (error) {
      console.error('Failed to save job:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      job_type: job.job_type || 'Full-time',
      salary: job.salary || '',
      education: job.education || '',
      education_duration: job.education_duration || '',
      required_skills: job.required_skills || job.skills || '',
      about_company: job.about_company || '',
      description: job.description || '',
      requirements: job.requirements || '',
      status: job.status || 'active',
    })
    setSkillInput('')
    setShowJobForm(true)
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      await jobsAPI.delete(jobId)
      fetchJobs()
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const resetJobForm = () => {
    setJobForm({
      title: '',
      company: '',
      location: '',
      job_type: 'Full-time',
      salary: '',
      education: '',
      education_duration: '',
      required_skills: '',
      about_company: '',
      description: '',
      requirements: '',
      status: 'active',
    })
    setSkillInput('')
  }

  const handleAddSkill = () => {
    const skill = skillInput.trim()
    if (!skill) return
    const existing = jobForm.required_skills
    const updated = existing ? `${existing}, ${skill}` : skill
    setJobForm({ ...jobForm, required_skills: updated })
    setSkillInput('')
  }

  const handleRemoveSkill = (skill) => {
    const skillsArray = jobForm.required_skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => s.toLowerCase() !== skill.toLowerCase())
    setJobForm({ ...jobForm, required_skills: skillsArray.join(', ') })
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const handleDownloadPDF = (applicantId) => {
    const url = pdfAPI.generate(applicantId)
    window.open(url, '_blank')
  }

  const handleViewResume = (e, resumeUrl) => {
    e.stopPropagation()
    if (resumeUrl) {
      const directUrl = resumeUrl.includes('dropbox.com') 
        ? resumeUrl.replace('?dl=0', '?dl=1').replace('?dl=1', '?raw=1')
        : resumeUrl
      setViewingResume(directUrl)
    }
  }

  const fetchApplicantDocuments = async (applicationId) => {
    try {
      const response = await applicationsAPI.getDocuments(applicationId)
      if (response.data.success) {
        setApplicantDocuments(response.data.documents || [])
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      setApplicantDocuments([])
    }
  }

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant)
    if (applicant.id) {
      fetchApplicantDocuments(applicant.id)
    }
  }

  const clearFilters = () => {
    setFilters({
      job_id: '',
      skills: '',
      profession: '',
      min_experience: '',
      max_experience: '',
      search: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {admin?.name}</p>
            </div>

    {viewJob && (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[70vh] overflow-y-auto animate-slide-down">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-primary-600 text-white rounded-t-2xl">
            <div>
              <p className="text-sm uppercase tracking-wider text-white/70">Job Detail</p>
              <h3 className="text-2xl font-semibold">{viewJob.title}</h3>
              <p className="text-white/80">{viewJob.company}</p>
            </div>
            <button
              className="text-white/80 hover:text-white"
              onClick={() => setViewJob(null)}
              aria-label="Close job details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 text-sm text-gray-700">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold">Location</p>
                <p className="font-semibold text-gray-900">{viewJob.location || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold">Job Type</p>
                <p className="font-semibold text-gray-900">{viewJob.job_type || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold">Salary</p>
                <p className="font-semibold text-gray-900">{viewJob.salary || 'Competitive'}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold">Status</p>
                <p className="font-semibold text-gray-900 capitalize">{viewJob.status || 'active'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-4 py-2 rounded-full shadow"
              >
                <Users className="w-4 h-4" />
                {viewJob.applicant_count || 0} applicant{(viewJob.applicant_count || 0) === 1 ? '' : 's'} applied
              </button>
            </div>

            {viewJob.description && (
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Description</p>
                <p className="text-gray-800 leading-relaxed">{viewJob.description}</p>
              </div>
            )}

            {viewJob.requirements && (
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-1">Requirements</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{viewJob.requirements}</p>
              </div>
            )}

            {viewJob.required_skills && (
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {viewJob.required_skills.split(',').map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewJob.about_company && (
              <div>
                <p className="text-gray-500 uppercase text-xs font-semibold mb-1">About Company</p>
                <p className="text-gray-800 leading-relaxed">{viewJob.about_company}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex flex-row flex-wrap gap-2 sm:gap-0 border-b bg-primary-50 rounded-t-lg">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors ${
                activeTab === 'jobs'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Manage Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold transition-colors ${
                activeTab === 'applications'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Applications ({applications.length})</span>
            </button>
          </div>

          <div className="px-[3px] py-6 sm:p-6">
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-xl font-bold text-gray-900">Job Listings</h2>
                  <button
                    onClick={() => {
                      resetJobForm()
                      setEditingJob(null)
                      setShowJobForm(true)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Job</span>
                  </button>
                </div>

              {jobForm.education && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Education Duration
                  </label>
                  <input
                    type="text"
                    name="education_duration"
                    value={jobForm.education_duration}
                    onChange={handleJobFormChange}
                    placeholder="e.g., 4 years program"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : jobs.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">No jobs found</p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="w-full border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setViewJob(job)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            <p className="text-primary-600 font-semibold">{job.company}</p>
                            <p className="text-sm text-gray-600 mt-1">{job.location} • {job.job_type}</p>
                            {job.salary && (
                              <p className="text-sm text-gray-600">{job.salary}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {job.applicant_count || 0} applicants
                            </p>
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditJob(job)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteJob(job.id)
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Applications</h2>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                          placeholder="Name, email, or phone"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Job
                      </label>
                      <select
                        value={filters.job_id}
                        onChange={(e) => setFilters({ ...filters, job_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      >
                        <option value="">All Jobs</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Skills
                      </label>
                      <input
                        type="text"
                        value={filters.skills}
                        onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                        placeholder="e.g., React, PHP"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Profession
                      </label>
                      <input
                        type="text"
                        value={filters.profession}
                        onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
                        placeholder="e.g., Developer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>

                  </div>

                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Showing {filteredApplications.length} of {applications.length} applications
                </p>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                ) : filteredApplications.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">No applications found</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => handleViewApplicant(applicant)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{applicant.full_name}</h3>
                            <p className="text-sm text-primary-600 font-semibold">{applicant.profession}</p>
                          </div>
                          <div className="flex gap-2">
                            {applicant.resume_url && (
                              <button
                                onClick={(e) => handleViewResume(e, applicant.resume_url)}
                                className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
                                title="View Resume"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownloadPDF(applicant.id)
                              }}
                              className="text-primary-600 hover:text-primary-700 p-2 rounded-full hover:bg-primary-50"
                              title="Download profile PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          {applicant.job_title && (
                            <div className="flex items-center space-x-2">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              <span>{applicant.job_title}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{applicant.experience || 0} yrs • {applicant.education || 'Education N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{applicant.email}</span>
                          </div>
                        </div>

                        {applicant.skills && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {applicant.skills.split(',').slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                            {applicant.skills.split(',').length > 4 && (
                              <span className="text-xs text-gray-500">+more</span>
                            )}
                          </div>
                        )}

                        {applicant.resume_url && (
                          <div className="mt-4">
                            <button
                              onClick={(e) => handleViewResume(e, applicant.resume_url)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300"
                            >
                              <FileText className="w-4 h-4" />
                              See Resume
                            </button>
                          </div>
                        )}

                        <div className="mt-4 text-sm text-primary-600 font-semibold flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          View full profile
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto my-8">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h2>
              <button
                onClick={() => {
                  setShowJobForm(false)
                  setEditingJob(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleJobSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleJobFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={jobForm.company}
                    onChange={handleJobFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleJobFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Job Type
                  </label>
                  <select
                    name="job_type"
                    value={jobForm.job_type}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleJobFormChange}
                    placeholder="e.g., ₹50,000 - ₹70,000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={jobForm.status}
                    onChange={handleJobFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Minimum Education
                  </label>
                  <select
                    name="education"
                    value={jobForm.education}
                    onChange={(e) => {
                      handleJobFormChange(e)
                      if (!e.target.value) {
                        setJobForm((prev) => ({ ...prev, education_duration: '' }))
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select qualification</option>
                    <option value="10th">10th Standard</option>
                    <option value="12th">12th Standard</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="MBA">MBA</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Required Skills
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  {jobForm.required_skills && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {jobForm.required_skills
                        .split(',')
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-primary-600 hover:text-primary-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleJobFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  About Company
                </label>
                <textarea
                  name="about_company"
                  value={jobForm.about_company}
                  onChange={handleJobFormChange}
                  rows="3"
                  placeholder="Share the company's culture, mission, perks, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleJobFormChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowJobForm(false)
                    setEditingJob(null)
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto my-8">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Applicant Profile</h2>
              <button
                onClick={() => {
                  setSelectedApplicant(null)
                  setApplicantDocuments([])
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ApplicantProfileCard 
                applicant={selectedApplicant} 
                showActions={true}
                onDownloadPDF={() => handleDownloadPDF(selectedApplicant.id)}
              />
              
              {selectedApplicant.resume_url && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Resume</span>
                    </div>
                    <button
                      onClick={(e) => handleViewResume(e, selectedApplicant.resume_url)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              )}

              {applicantDocuments.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Other Documents</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {applicantDocuments.filter(doc => 
                      doc.file_path && 
                      (doc.file_path.includes('cloudinary') || 
                       doc.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                    ).map((doc, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={doc.file_path}
                          alt={doc.original_name || `Document ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(doc.file_path, '_blank')}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg">
                          <p className="truncate">{doc.doc_type || 'Document'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedApplicant(null)
                  setApplicantDocuments([])
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingResume && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4">
          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Resume Preview</h3>
              <button
                onClick={() => setViewingResume(null)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <iframe
              src={viewingResume}
              className="w-full h-[calc(100%-60px)]"
              title="Resume Preview"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
