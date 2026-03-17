import React, { useState } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'
import { applicationsAPI } from '../services/api'

const DOCUMENT_OPTIONS = [
  'Aadhaar Card',
  'PAN Card',
  'Marksheet',
  'Degree Certificate',
  'Experience Letter',
  'Resume',
  'Other',
]

const ApplicationForm = ({ job, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    profession: '',
    experience: '',
    languages: '',
    education: '',
    education_start: '',
    education_end: '',
    bio: '',
    contact_info: '',
  })
  
  const [profileImage, setProfileImage] = useState(null)
  const [documents, setDocuments] = useState([])
  const [selectedDocType, setSelectedDocType] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [skills, setSkills] = useState([])

  const availableDocOptions = DOCUMENT_OPTIONS.filter(
    (option) => option === 'Other' || !documents.some((doc) => doc.type === option)
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddSkill = () => {
    const trimmed = skillsInput.trim()
    if (!trimmed) return
    if (skills.includes(trimmed)) {
      setSkillsInput('')
      return
    }
    setSkills((prev) => [...prev, trimmed])
    setSkillsInput('')
  }

  const handleRemoveSkill = (skill) => {
    setSkills((prev) => prev.filter((item) => item !== skill))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!selectedDocType) {
      setError('Please select a document type before uploading.')
      e.target.value = ''
      return
    }

    // Validate file type based on document type
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()
    
    if (selectedDocType === 'Resume') {
      // Resume must be PDF only
      if (fileType !== 'application/pdf' && !fileName.endsWith('.pdf')) {
        setError('Resume must be a PDF file only.')
        e.target.value = ''
        return
      }
    } else {
      // Other documents must be images only
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validImageTypes.includes(fileType) && !fileName.match(/\.(jpg|jpeg|png)$/)) {
        setError(`${selectedDocType} must be an image file (JPG or PNG only).`)
        e.target.value = ''
        return
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Each document must be under 10MB.')
      e.target.value = ''
      return
    }

    const newDoc = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: selectedDocType,
      file,
      name: file.name,
    }

    setDocuments((prev) => [...prev, newDoc])
    setSelectedDocType('')
    setError('')
    e.target.value = ''
  }

  const handleRemoveDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!skills.length) {
      setError('Please add at least one skill before submitting.')
      setLoading(false)
      return
    }

    if (formData.education && (!formData.education_start || !formData.education_end)) {
      setError('Please provide your education duration (start and end dates).')
      setLoading(false)
      return
    }

    try {
      const submitData = new FormData()
      submitData.append('job_id', job.id)
      
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })

      submitData.append('skills', skills.join(', '))
      
      if (profileImage) {
        submitData.append('profile_image', profileImage)
      }

      if (documents.length) {
        documents.forEach((doc) => {
          submitData.append('documents[]', doc.file)
          submitData.append('document_types[]', doc.type)
        })
      }

      const response = await applicationsAPI.submit(submitData)
      
      if (response.data.success) {
        onSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full md:w-auto md:max-w-2xl my-8 animate-slide-down max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b bg-primary-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Apply for Position</h2>
            <p className="text-sm text-white/80 mt-1">{job.title} at {job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Profession / Current Role *
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Total Experience (years) *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Languages Known *
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                required
                placeholder="e.g., English, Hindi, Spanish"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Education *
            </label>
            <select
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="" disabled>
                Select your highest qualification
              </option>
              {['10th', '12th', 'Diploma', "Bachelor's", "Master's", 'PhD', 'Other'].map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
            {formData.education && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Education Start
                  </label>
                  <input
                    type="month"
                    name="education_start"
                    value={formData.education_start}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Education End
                  </label>
                  <input
                    type="month"
                    name="education_end"
                    value={formData.education_end}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Skills *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
                placeholder="Add a skill and press Add"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
              >
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold border border-primary-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-primary-500 hover:text-primary-700"
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              About / Short Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              rows="2"
              required
              placeholder="Enter your full address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
              )}
              <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Max size: 5MB (JPG, PNG, WEBP)</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Documents / Certificates
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="" disabled>
                  Select document type
                </option>
                {availableDocOptions.length === 0 ? (
                  <option value="" disabled>
                    All document types uploaded
                  </option>
                ) : (
                  availableDocOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))
                )}
              </select>

              <label className="flex items-center justify-between px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Upload className="w-5 h-5" />
                  Upload file
                </div>
                <span className="text-xs text-gray-500">Max 10MB</span>
                <input
                  type="file"
                  accept={selectedDocType === 'Resume' ? '.pdf,application/pdf' : '.jpg,.jpeg,.png,image/jpeg,image/png'}
                  onChange={handleDocumentChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Resume:</strong> PDF only | <strong>Other documents:</strong> JPG/PNG images only (Aadhaar, PAN, marksheets, degrees, etc.)
            </p>

            {documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{doc.type}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[220px]">{doc.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-red-500 hover:text-red-600"
                      aria-label={`Remove ${doc.type}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {error && (
              <div className="order-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="order-1 flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="order-1 flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationForm
