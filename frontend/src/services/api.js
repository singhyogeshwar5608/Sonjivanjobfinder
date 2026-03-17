import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://sksanjivan.com/backend_son-jivan'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const jobsAPI = {
  getAll: () => api.get('/api/jobs/index.php'),
  getById: (id) => api.get(`/api/jobs/index.php?id=${id}`),
  create: (data) => api.post('/api/jobs/index.php', data),
  update: (data) => api.put('/api/jobs/index.php', data),
  delete: (id) => api.delete('/api/jobs/index.php', { data: { id } }),
}

export const applicationsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return api.get(`/api/applications/index.php?${params}`)
  },
  submit: (formData) => {
    return axios.post(`${API_URL}/api/applications/index.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getDocuments: (applicationId) => {
    return api.get(`/api/applications/documents.php?application_id=${applicationId}`)
  },
}

export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login.php', credentials),
  verify: () => api.get('/api/admin/verify.php'),
}

export const profileAPI = {
  getById: (id) => api.get(`/api/profiles/index.php?id=${id}`),
}

export const pdfAPI = {
  generate: (id, type = 'profile') => {
    const token = localStorage.getItem('admin_token')
    return `${API_URL}/api/pdf/generate_simple.php?id=${id}&type=${type}&token=${token}`
  },
}

export default api
