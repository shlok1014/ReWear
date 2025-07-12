import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getFeatured: () => api.get('/items/featured'),
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items', itemData),
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  delete: (id) => api.delete(`/items/${id}`),
  toggleLike: (id) => api.post(`/items/${id}/like`),
  requestSwap: (id, message) => api.post(`/items/${id}/swap-request`, { message }),
  
  // Admin routes
  getPending: () => api.get('/items/admin/pending'),
  updateStatus: (id, status, reason) => api.put(`/items/admin/${id}/status`, { status, reason }),
  toggleFeature: (id, isFeatured, featuredUntil) => api.put(`/items/admin/${id}/feature`, { isFeatured, featuredUntil }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  getMyItems: (params) => api.get('/users/my-items', { params }),
  getSwapRequests: (params) => api.get('/users/swap-requests', { params }),
  getReceivedRequests: (params) => api.get('/users/received-requests', { params }),
  respondToSwapRequest: (itemId, requestId, status, message) => 
    api.put(`/users/swap-request/${itemId}/${requestId}`, { status, message }),
  getStats: () => api.get('/users/stats'),
  
  // Admin routes
  getAllUsers: (params) => api.get('/users/admin/all', { params }),
  getUserById: (userId) => api.get(`/users/admin/${userId}`),
  updateUserRole: (userId, role) => api.put(`/users/admin/${userId}/role`, { role }),
  banUser: (userId, isBanned, reason) => api.put(`/users/admin/${userId}/ban`, { isBanned, reason }),
  getDashboard: () => api.get('/users/admin/dashboard'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 