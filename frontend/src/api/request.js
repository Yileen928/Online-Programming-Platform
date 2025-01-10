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
    // 开发环境返回模拟数据
    if (process.env.NODE_ENV === 'development') {
      if (config.url === '/api/user/recent-projects') {
        return Promise.resolve({
          data: {
            data: [
              {
                id: 1,
                title: '圆周计算',
                description: '计算圆周率的项目',
                lastModified: '35分钟前'
              },
              {
                id: 2,
                title: '排序算法',
                description: '实现各种排序算法',
                lastModified: '1小时前'
              },
              {
                id: 3,
                title: '数据结构',
                description: '基础数据结构实现',
                lastModified: '3天前'
              }
            ]
          }
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
