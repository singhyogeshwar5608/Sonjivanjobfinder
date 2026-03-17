import React from 'react'
import { MapPin, Briefcase, Calendar } from 'lucide-react'

const JobCard = ({ job, onApply, onViewDetails }) => {
  return (
    <div
      className="group cursor-pointer rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-6 transition-all h-full flex flex-col"
      onClick={() => onViewDetails?.(job)}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{job.title}</h3>
          <p className="text-sm text-white/80">{job.company}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onApply(job)
          }}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold tracking-wide transition-all whitespace-nowrap md:self-start shadow-lg shadow-blue-900/30"
        >
          Apply Now
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-white/80 text-sm">
        <div className="inline-flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{job.location || 'Location flexible'}</span>
        </div>

        {job.job_type && (
          <div className="inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span>{job.job_type}</span>
          </div>
        )}

        {job.salary && (
          <div className="inline-flex items-center gap-2">
            <span className="text-lg font-semibold">₹</span>
            <span>{job.salary.replace(/\$/g, '').trim()}</span>
          </div>
        )}

        <div className="inline-flex items-center gap-2 text-white/60 text-xs">
          <Calendar className="w-4 h-4" />
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex-1">
        {job.description && (
          <p className="text-white/80 text-sm mt-4 max-w-3xl line-clamp-3">
            {job.description}
          </p>
        )}

        {job.requirements && (
          <div className="mt-3 text-xs text-white/70 max-w-3xl">
            <p className="uppercase tracking-[0.3em] text-white/40 mb-1">Requirements</p>
            <p className="leading-relaxed whitespace-pre-line line-clamp-3">{job.requirements}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCard
