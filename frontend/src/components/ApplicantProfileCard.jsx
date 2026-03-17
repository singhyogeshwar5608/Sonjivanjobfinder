import React from 'react'
import { Mail, Phone, Briefcase, GraduationCap, Languages, Award, User } from 'lucide-react'

const ApplicantProfileCard = ({ applicant, showActions = false, onDownloadPDF }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/sonjivan_job_finder/backend'
  const profileImageUrl = applicant.profile_image
    ? applicant.profile_image.startsWith('http')
      ? applicant.profile_image
      : `${API_URL}/uploads/${applicant.profile_image}`
    : null

  const skills = applicant.skills ? applicant.skills.split(',').map(s => s.trim()) : []

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-2">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-24"></div>
      
      <div className="relative px-6 pb-6">
        <div className="flex flex-col items-center -mt-16 mb-4">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={applicant.full_name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 mt-4 text-center">
            {applicant.full_name}
          </h2>
          <p className="text-primary-600 font-semibold text-lg">
            {applicant.profession}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold">Email</p>
              <p className="text-sm text-gray-900">{applicant.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold">Phone</p>
              <p className="text-sm text-gray-900">{applicant.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Award className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold">Experience</p>
              <p className="text-sm text-gray-900">{applicant.experience} years</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <GraduationCap className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold">Education</p>
              <p className="text-sm text-gray-900">{applicant.education}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Languages className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 font-semibold">Languages</p>
              <p className="text-sm text-gray-900">{applicant.languages}</p>
            </div>
          </div>

          {skills.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {applicant.bio && (
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">About</p>
              <p className="text-sm text-gray-700 leading-relaxed">{applicant.bio}</p>
            </div>
          )}

          {applicant.job_title && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-xs text-gray-500 font-semibold mb-1">Applied For</p>
              <p className="text-sm font-semibold text-gray-900">{applicant.job_title}</p>
              {applicant.company && (
                <p className="text-sm text-gray-600">{applicant.company}</p>
              )}
            </div>
          )}
        </div>

        {showActions && onDownloadPDF && (
          <div className="mt-6 print:hidden">
            <button
              onClick={onDownloadPDF}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicantProfileCard
