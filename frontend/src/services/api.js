import axios from 'axios'

// Configurar interceptores para manejar errores
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { api }

// Configurar el token en las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Records Service
export const recordsApi = {
  getAll: () => api.get('/records'),
  getById: (id) => api.get(`/records/${id}`),
  create: (data) => api.post('/records', data),
  update: (id, data) => api.put(`/records/${id}`, data),
  delete: (id) => api.delete(`/records/${id}`)
}

// Audit Service
export const auditApi = {
  getAll: () => api.get('/audit'),
  getStats: () => api.get('/audit/stats'),
  updateLikert: (id, likert) => api.put(`/audit/${id}/likert`, { likert })
}

// Configure axios interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
