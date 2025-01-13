import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080' 
    : 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
