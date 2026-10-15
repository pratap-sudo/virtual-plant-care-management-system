import axios from 'axios';

// Base URL for all API calls.
// In development, Vite proxies /api to localhost:8080 (see vite.config.js).
const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ============================================================
// Plant API
// ============================================================

export const plantAPI = {
  // GET /api/plants
  getAll: (params = {}) => api.get('/plants', { params }),

  // GET /api/plants/:id
  getById: (id) => api.get(`/plants/${id}`),

  // POST /api/plants
  create: (data) => api.post('/plants', data),

  // PUT /api/plants/:id
  update: (id, data) => api.put(`/plants/${id}`, data),

  // DELETE /api/plants/:id
  delete: (id) => api.delete(`/plants/${id}`),

  // POST /api/plants/:id/water
  water: (id, notes = '') => api.post(`/plants/${id}/water`, { notes }),

  // GET /api/plants/due-today
  getDueToday: () => api.get('/plants/due-today'),

  // GET /api/plants/overdue
  getOverdue: () => api.get('/plants/overdue'),
};

// ============================================================
// Care Activity API
// ============================================================

export const activityAPI = {
  // GET /api/activities
  getAll: () => api.get('/activities'),

  // POST /api/activities
  create: (data) => api.post('/activities', data),

  // GET /api/activities/plant/:plantId
  getByPlant: (plantId) => api.get(`/activities/plant/${plantId}`),
};

// ============================================================
// Dashboard API
// ============================================================

export const dashboardAPI = {
  // GET /api/dashboard
  getStats: () => api.get('/dashboard'),
};

export default api;
