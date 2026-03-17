import React, { useState, useEffect } from 'react'
import {
  Briefcase,
  TrendingUp,
  Users,
  CheckCircle,
  MapPin,
  Search,
  Sparkles,
  Shield,
  Menu,
  X,
} from 'lucide-react'
import BengaluruImg from '../assets/images/bangalore.png'
import DelhiImg from '../assets/images/delhi.png'
import HyderabadImg from '../assets/images/hydrabad.png'
import PuneImg from '../assets/images/Pune.png'
import NoidaImg from '../assets/images/Noida.png'
import KolkataImg from '../assets/images/Kolkata.png'
import LucknowImg from '../assets/images/Lucknow.png'
import jobFinderLogo from '../assets/logo/sanjivni1.png'
import Gallery1 from '../assets/gallery/gallery1.png'
import Gallery2 from '../assets/gallery/gallery2.png'
import Gallery3 from '../assets/gallery/gallery3.png'
import Gallery4 from '../assets/gallery/gallery4.png'
import Gallery5 from '../assets/gallery/gallery5.png'
import JobCard from '../components/JobCard'
import ApplicationForm from '../components/ApplicationForm'
import MobileNav from '../components/MobileNav'
import { jobsAPI } from '../services/api'

const LandingPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobDetail, setJobDetail] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const citySpotlight = [
    {
      city: 'Bengaluru',
      jobs: '27K+ roles',
      image: BengaluruImg,
    },
    {
      city: 'Delhi',
      jobs: '24K+ roles',
      image: DelhiImg,
    },
    {
      city: 'Hyderabad',
      jobs: '21K+ roles',
      image: HyderabadImg,
    },
    {
      city: 'Pune',
      jobs: '18K+ roles',
      image: PuneImg,
    },
    {
      city: 'Noida',
      jobs: '15K+ roles',
      image: NoidaImg,
    },
    {
      city: 'Kolkata',
      jobs: '12K+ roles',
      image: KolkataImg,
    },
    {
      city: 'Lucknow',
      jobs: '9K+ roles',
      image: LucknowImg,
    },
  ]

  const heroSlides = [Gallery1, Gallery2, Gallery3, Gallery4, Gallery5]

  const galleryShowcase = [
    { id: 1, label: 'Leadership Connect', image: Gallery1 },
    { id: 2, label: 'Collaborative Sprint', image: Gallery2 },
    { id: 3, label: 'Design Review', image: Gallery3 },
    { id: 4, label: 'Talent Spotlight', image: Gallery4 },
    { id: 5, label: 'Culture Moments', image: Gallery5 },
  ]

  const contactShowcaseImage = Gallery4

  const [heroSlideIndex, setHeroSlideIndex] = useState(0)
  const [heroJobQuery, setHeroJobQuery] = useState('')
  const [heroLocationQuery, setHeroLocationQuery] = useState('')
  const [jobFilters, setJobFilters] = useState({ title: '', location: '' })

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [heroSlides.length])

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll('?all=1')
      if (response.data.success) {
        setJobs(response.data.jobs)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = (job) => {
    setSelectedJob(job)
    setShowApplicationForm(true)
  }

  const handleViewDetails = (job) => {
    setJobDetail(job)
  }

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHeroSearch = (e) => {
    e.preventDefault()
    setJobFilters({
      title: heroJobQuery.trim(),
      location: heroLocationQuery.trim(),
    })
    scrollToSection('jobs')
  }

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = jobFilters.title
      ? job?.title?.toLowerCase().includes(jobFilters.title.toLowerCase())
      : true
    const locationMatch = jobFilters.location
      ? job?.location?.toLowerCase().includes(jobFilters.location.toLowerCase())
      : true
    return titleMatch && locationMatch
  })

  const headerLinks = [
    { href: '#home', label: 'Home' },
    { href: '#jobs', label: 'Jobs' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={jobFinderLogo}
                alt="Son Jivan Job Finder"
                className="h-12 w-auto object-contain"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#1d4ed8] hover:text-[#0f172a] font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/admin/login"
                className="inline-flex items-center bg-[#2563eb] text-white font-semibold px-4 py-2 rounded-full border border-[#1d4ed8]/20 hover:bg-[#1d4ed8]"
              >
                Admin
              </a>
            </nav>
            <button
              className="md:hidden text-[#1d4ed8] p-2 rounded-lg border border-[#93c5fd]"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#1d4ed8] font-semibold rounded-lg px-3 py-2 bg-blue-50 hover:bg-blue-100"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/admin/login"
                className="block text-center text-white font-semibold rounded-lg px-3 py-2 bg-[#2563eb] hover:bg-[#1d4ed8]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </a>
            </div>
          </div>
        )}
      </header>

      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-down flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Application submitted successfully!</span>
        </div>
      )}

      <section className="relative bg-gradient-to-br from-[#090b1a] via-[#101a33] to-[#1c2d54] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="pulse-ring absolute top-16 left-12 w-56 h-56 bg-primary-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 right-10 w-72 h-72 bg-accent-400/25 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white/10 text-white text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Trusted hiring platform</span>
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Hire faster, <span className="text-blue-600">land jobs smarter</span>
              </h1>
              <p className="mt-4 text-lg text-white/80">
                Join 50,000+ professionals using Son Jivan to connect with ambitious teams, track applications, and secure interviews in days, not weeks.
              </p>

              <form onSubmit={handleHeroSearch} className="mt-8 bg-white border border-[#F5F7FA] rounded-2xl shadow-xl p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-500">Job Title</label>
                    <div className="flex items-center mt-1 bg-white rounded-lg px-3 py-2 border border-[#E4E7EC]">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. Product Designer"
                        value={heroJobQuery}
                        onChange={(e) => setHeroJobQuery(e.target.value)}
                        className="bg-transparent flex-1 ml-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500">Location</label>
                    <div className="flex items-center mt-1 bg-white rounded-lg px-3 py-2 border border-[#E4E7EC]">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="City or remote"
                        value={heroLocationQuery}
                        onChange={(e) => setHeroLocationQuery(e.target.value)}
                        className="bg-transparent flex-1 ml-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 rounded-xl transition-colors"
                  type="submit"
                >
                  Start searching
                </button>
              </form>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
                  <p className="text-3xl font-bold text-white">4.8/5</p>
                  <p className="text-sm text-white/70 mt-1">Average candidate rating</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
                  <p className="text-3xl font-bold text-white">2k+</p>
                  <p className="text-sm text-white/70 mt-1">Interviews scheduled monthly</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-4 md:p-6 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden h-72 md:h-[420px]">
                  {heroSlides.map((slide, index) => (
                    <img
                      key={`hero-slide-${index}`}
                      src={slide}
                      alt={`Hiring showcase ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-in-out ${
                        heroSlideIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-xs font-semibold text-primary-600 backdrop-blur">
                    Live studios
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroSlides.map((_, index) => (
                      <span
                        key={`hero-dot-${index}`}
                        className={`h-2.5 w-8 rounded-full transition-all ${
                          heroSlideIndex === index ? 'bg-primary-200' : 'bg-white/50'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-6 left-6 right-6 bg-white shadow-xl rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Top companies hiring</p>
                    <p className="text-base font-semibold text-gray-900">Tech, Finance, Healthcare</p>
                  </div>
                  <Shield className="w-10 h-10 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your <span className="text-primary-600">Dream Job</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover thousands of job opportunities with all the information you need. 
              Your next career move starts here.
            </p>
            <button
              onClick={() => scrollToSection('jobs')}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Browse Jobs
            </button>

            <div className="mt-12 text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">City Spotlight</p>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">Hiring hotspots across India</h3>
                  <p className="text-sm text-gray-500">Scroll through the cities where Son Jivan talents are landing interviews.</p>
                </div>
                <button
                  onClick={() => scrollToSection('jobs')}
                  className="inline-flex items-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-sm px-5 py-2 rounded-full shadow"
                >
                  View all cities →
                </button>
              </div>

              <div className="mt-8 overflow-hidden">
                <div className="flex gap-6 marquee-track">
                  {[...citySpotlight, ...citySpotlight].map((city, index) => (
                    <div
                      key={`${city.city}-${index}`}
                      className="min-w-[220px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
                    >
                      <div className="h-36 w-full overflow-hidden">
                        <img
                          src={city.image}
                          alt={city.city}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-lg font-semibold text-gray-900">{city.city}</p>
                        <p className="text-sm text-gray-500">{city.jobs}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow animate-slide-up border border-white/5">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quality Jobs</h3>
              <p className="text-white/70">
                Access to verified job postings from top companies across various industries.
              </p>
            </div>

            <div
              className="bg-gradient-to-br from-[#0b1120] via-[#1c2541] to-[#17424d] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow animate-slide-up border border-white/5"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Career Growth</h3>
              <p className="text-white/70">
                Find opportunities that match your skills and help you advance your career.
              </p>
            </div>

            <div
              className="bg-gradient-to-br from-[#111827] via-[#202852] to-[#0f172a] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow animate-slide-up border border-white/5"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Easy Apply</h3>
              <p className="text-white/70">
                Simple application process with no resume required. Just fill out a quick form.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className="relative py-16 bg-[#040919] text-white">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.35),_transparent_50%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Available Positions
            </h2>
            <p className="text-lg text-white/80">
              Browse through our latest job openings and apply today
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/70 text-lg">No jobs available at the moment</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl font-semibold text-white mb-2">No matches found</p>
              <p className="text-white/80">Try adjusting your job title or location filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <div key={job.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <JobCard job={job} onApply={handleApply} onViewDetails={handleViewDetails} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-24 bg-[#050818] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-10 w-64 h-64 bg-primary-600/40 rounded-full blur-[140px]"></div>
          <div className="absolute top-32 right-0 w-72 h-72 bg-accent-500/30 rounded-full blur-[160px]"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050818]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1 text-xs font-bold tracking-[0.3em] uppercase bg-white/10 rounded-full">
              Culture Gallery
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-extrabold">
              Energetic snapshots from <span className="text-primary-200">Son Jivan</span> experiences
            </h2>
            <p className="mt-3 text-white/70 max-w-2xl mx-auto">
              Swipe through the live sets, leadership jams, and collaborative lounges where candidates and teams connect in style.
            </p>
          </div>

          <div className="grid lg:grid-cols-[0.8fr,1.2fr] gap-10">
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <p className="text-xs tracking-[0.4em] uppercase text-white/60">Behind the scenes</p>
                <h3 className="text-3xl font-bold mt-3">Studios engineered for momentum</h3>
                <p className="text-white/70 mt-3">
                  Dedicated storytellers, cinematic lighting rigs, and collaborative sprint rooms make every candidate feel like the main character.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Studio Tours', 'Sprint Reviews', 'Pitch Days', 'Celebration Nights'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full border border-white/20 text-sm font-medium text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60">Immersive demo days</p>
                  <p className="text-4xl font-extrabold mt-2">38 cities</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">and counting</p>
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent-400">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/80">Experience score</p>
                  <p className="text-4xl font-bold mt-3">9.6/10</p>
                  <p className="text-sm text-white/80">Average candidate delight</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                {['AR interview pods', 'Creator-grade lighting', 'Live feedback loop', 'Open studio hours'].map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 rounded-full border border-dashed border-white/25"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <button className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-2xl font-semibold text-white">
                View production playbook
                <span aria-hidden>→</span>
              </button>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[36px] border border-white/10 shadow-[0_35px_90px_rgba(0,0,0,0.5)]">
                <div className="flex" style={{ transform: `translateX(-${heroSlideIndex * 100}%)`, transition: 'transform 700ms ease' }}>
                  {galleryShowcase.map((item) => (
                    <div key={item.id} className="w-full shrink-0">
                      <div className="relative h-80">
                        <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
                        <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-primary-600">
                          Live now
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                          <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Spotlight</p>
                          <h3 className="text-3xl font-semibold">{item.label}</h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
                            <span className="inline-flex items-center gap-1">
                              <Users className="w-4 h-4" /> 40+ guests
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Sparkles className="w-4 h-4" /> HD Capture
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Weekly curation drop</div>
                <div className="flex gap-2">
                  {galleryShowcase.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 w-8 rounded-full transition-all ${heroSlideIndex === index ? 'bg-white' : 'bg-white/30'}`}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative pt-5 pb-20 bg-gradient-to-br from-[#eef2ff] via-white to-[#f0f9ff] overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="pulse-ring absolute top-8 right-12 w-48 h-48 bg-primary-200/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 left-6 w-64 h-64 bg-accent-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-base text-gray-700">
              Have questions? We're here to help you find the perfect job.
            </p>
          </div>

          <div className="grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E4E7EC]">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-600">
                contact team
              </p>
              <h3 className="text-xl font-bold text-gray-900 mt-4">
                Talk to real hiring strategists, not chatbots
              </h3>
              <p className="text-gray-600 mt-4 text-sm">
                Our concierge recruiters respond within 2 hours on weekdays. Share your hiring goals or role preferences and we'll curate a tailored response.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { label: 'Email', value: 'info@sonjivan.com' },
                  { label: 'Phone', value: '+91-94614-94614' },
                  { label: 'Hours', value: 'Mon-Fri · 9AM - 6PM IST' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-semibold">
                      {item.label[0]}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                {['WhatsApp connect', 'Live demo', 'Custom proposal'].map((chip) => {
                  const isWhatsapp = chip === 'WhatsApp connect'
                  const sharedClasses = 'px-4 py-2 rounded-full border border-primary-100 bg-primary-50/60 text-primary-600 text-sm font-medium'

                  if (isWhatsapp) {
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => window.open('https://wa.me/919461494614', '_blank')}
                        className={`${sharedClasses} hover:bg-primary-100 transition-colors`}
                      >
                        {chip}
                      </button>
                    )
                  }

                  return (
                    <span key={chip} className={sharedClasses}>
                      {chip}
                    </span>
                  )
                })}
              </div>

              <button
                className="mt-8 inline-flex items-center justify-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
                onClick={() => (window.location.href = 'tel:+919461494614')}
              >
                Speak with us
              </button>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-6 w-32 h-32 bg-primary-200/60 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent-200/50 rounded-full blur-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur rounded-[32px] border border-white shadow-[0_30px_60px_rgba(15,23,42,0.15)] p-6 float-slow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.4em]">Support room</p>
                    <p className="text-lg font-semibold text-gray-900">Live concierge</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={contactShowcaseImage}
                    alt="Concierge contact"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/70">Concierge spotlight</p>
                    <p className="text-xl font-semibold">Client onboarding & role-matching studio</p>
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Avg response</p>
                    <p className="text-xl font-bold text-gray-900">1h 42m</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Channels</p>
                    <p className="text-sm font-semibold text-primary-600">Mail · WhatsApp · Zoom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Job Finder. All rights reserved.
          </p>
        </div>
      </footer>

      <MobileNav activeSection={activeSection} onNavigate={scrollToSection} />

      {showApplicationForm && selectedJob && (
        <ApplicationForm
          job={selectedJob}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}

      {jobDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-slide-up">
            <div className="bg-primary-600 text-white flex justify-between items-start p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">Job spotlight</p>
                <h3 className="text-2xl font-bold mt-2">{jobDetail.title}</h3>
                <p className="text-sm text-white/80">{jobDetail.company}</p>
              </div>
              <button
                onClick={() => setJobDetail(null)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Location</p>
                  <p className="font-semibold text-gray-900">{jobDetail.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Employment</p>
                  <p className="font-semibold text-gray-900">{jobDetail.job_type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Salary</p>
                  <p className="font-semibold text-gray-900">
                    {jobDetail.salary ? `₹ ${jobDetail.salary.replace(/\$/g, '').trim()}` : 'Competitive'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Posted</p>
                  <p className="font-semibold text-gray-900">{new Date(jobDetail.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {jobDetail.description && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">About the role</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{jobDetail.description}</p>
                </div>
              )}

              {jobDetail.requirements && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Key requirements</p>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{jobDetail.requirements}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => {
                    setJobDetail(null)
                    handleApply(jobDetail)
                  }}
                  className="flex-1 min-w-[180px] bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-2xl shadow-lg text-center"
                >
                  Apply for this role
                </button>
                <button
                  onClick={() => setJobDetail(null)}
                  className="flex-1 min-w-[150px] border border-gray-300 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
