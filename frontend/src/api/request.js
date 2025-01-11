import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080' 
    : 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 开发环境返回空数组
    if (process.env.NODE_ENV === 'development') {
      if (config.url === '/api/datasets') {
        return Promise.resolve({
          data: []
        });
      }
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
      // token过期或未登录
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
