import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// API endpoints
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    getMe: () => api.get('/auth/me'),
};

export const productsAPI = {
    getAll: (params?: any) => api.get('/products', { params }),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
    getAllAdmin: () => api.get('/products/admin/all'),
};

export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getById: (id: string) => api.get(`/categories/${id}`),
    create: (data: any) => api.post('/categories', data),
    update: (id: string, data: any) => api.put(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
    getAllAdmin: () => api.get('/categories/admin/all'),
};

export const ordersAPI = {
    create: (data: any) => api.post('/orders', data),
    getAll: (params?: any) => api.get('/orders', { params }),
    getById: (id: string) => api.get(`/orders/${id}`),
    updateStatus: (id: string, status: string) =>
        api.patch(`/orders/${id}/status`, { status }),
    getStats: () => api.get('/orders/stats/summary'),
};

export const settingsAPI = {
    getPublic: () => api.get('/settings/public'),
    get: () => api.get('/settings'),
    update: (data: any) => api.put('/settings', data),
};

export const uploadAPI = {
    single: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    multiple: (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        return api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};
