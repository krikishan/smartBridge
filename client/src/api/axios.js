import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopez_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shopez_token');
      localStorage.removeItem('shopez_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  addAddress: (data) => API.post('/auth/address', data),
  updateAddress: (id, data) => API.put(`/auth/address/${id}`, data),
  deleteAddress: (id) => API.delete(`/auth/address/${id}`),
  toggleWishlist: (productId) => API.put(`/auth/wishlist/${productId}`),
};

// Product API
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getCategories: () => API.get('/products/categories/list'),
  getBrands: () => API.get('/products/brands/list'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart', data),
  updateQuantity: (productId, quantity) => API.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => API.delete(`/cart/${productId}`),
  clear: () => API.delete('/cart/clear'),
};

// Order API
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getUserOrders: () => API.get('/orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  getAll: (params) => API.get('/orders/admin/all', { params }),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  getConfig: () => API.get('/admin/config'),
  updateBanner: (banner) => API.put('/admin/banner', { banner }),
  addBanner: (data) => API.post('/admin/banner', data),
  deleteBanner: (id) => API.delete(`/admin/banner/${id}`),
  getCategories: () => API.get('/admin/categories'),
  addCategory: (data) => API.post('/admin/categories', data),
  updateCategory: (id, data) => API.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),
};

export default API;
