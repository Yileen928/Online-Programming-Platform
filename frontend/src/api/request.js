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
    return response.data;  // 直接返回响应数据
  },
  error => {
    console.error('请求错误:', error);
    throw error?.response?.data || error;
  }
);

export default request;
