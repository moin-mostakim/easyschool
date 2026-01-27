import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// School API
export const schoolAPI = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/schools', { params }),
  getById: (id: string) => api.get(`/schools/${id}`),
  create: (data: any) => api.post('/schools', data),
  update: (id: string, data: any) => api.put(`/schools/${id}`, data),
  approve: (id: string) => api.post(`/schools/${id}/approve`),
  suspend: (id: string) => api.post(`/schools/${id}/suspend`),
};

// Student API
export const studentAPI = {
  getAll: (params?: { page?: number; limit?: number; schoolId?: string }) =>
    api.get('/students', { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

// Teacher API
export const teacherAPI = {
  getAll: (params?: { page?: number; limit?: number; schoolId?: string }) =>
    api.get('/teachers', { params }),
  getById: (id: string) => api.get(`/teachers/${id}`),
  create: (data: any) => api.post('/teachers', data),
  update: (id: string, data: any) => api.put(`/teachers/${id}`, data),
  delete: (id: string) => api.delete(`/teachers/${id}`),
};

// Parent API
export const parentAPI = {
  getAll: (params?: { page?: number; limit?: number; schoolId?: string }) =>
    api.get('/parents', { params }),
  getById: (id: string) => api.get(`/parents/${id}`),
  create: (data: any) => api.post('/parents', data),
  update: (id: string, data: any) => api.put(`/parents/${id}`, data),
  delete: (id: string) => api.delete(`/parents/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (params?: { page?: number; limit?: number; schoolId?: string; studentId?: string; date?: string }) =>
    api.get('/attendances', { params }),
  getById: (id: string) => api.get(`/attendances/${id}`),
  create: (data: any) => api.post('/attendances', data),
  update: (id: string, data: any) => api.put(`/attendances/${id}`, data),
  delete: (id: string) => api.delete(`/attendances/${id}`),
};

// Exam API
export const examAPI = {
  getAll: (params?: { page?: number; limit?: number; schoolId?: string }) =>
    api.get('/exams', { params }),
  getById: (id: string) => api.get(`/exams/${id}`),
  create: (data: any) => api.post('/exams', data),
  update: (id: string, data: any) => api.put(`/exams/${id}`, data),
  delete: (id: string) => api.delete(`/exams/${id}`),
  addMarks: (examId: string, data: any) => api.post(`/exams/${examId}/marks`, data),
  getResults: (examId: string) => api.get(`/exams/${examId}/results`),
};

// Fees API
export const feesAPI = {
  getAll: (params?: { page?: number; limit?: number; schoolId?: string; studentId?: string }) =>
    api.get('/fees', { params }),
  getById: (id: string) => api.get(`/fees/${id}`),
  create: (data: any) => api.post('/fees', data),
  update: (id: string, data: any) => api.put(`/fees/${id}`, data),
  delete: (id: string) => api.delete(`/fees/${id}`),
  recordPayment: (id: string, data: any) => api.post(`/fees/${id}/payment`, data),
};

// Communication API
export const communicationAPI = {
  getNotices: (params?: { page?: number; limit?: number; schoolId?: string }) =>
    api.get('/communications/notices', { params }),
  createNotice: (data: any) => api.post('/communications/notices', data),
  getMessages: (params?: { page?: number; limit?: number; schoolId?: string }) =>
    api.get('/communications/messages', { params }),
  createMessage: (data: any) => api.post('/communications/messages', data),
};

export default api;
