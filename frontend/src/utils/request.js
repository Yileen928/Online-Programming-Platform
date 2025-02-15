import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:8080',  // 确保这个地址正确
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    // 处理头像请求
    if (config.url.includes('/avatars/')) {
      config.responseType = 'arraybuffer';
      config.headers['Accept'] = 'image/*';
      // 头像请求不需要认证
      return config;
    }
    
    // 其他请求添加token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 处理头像响应
    if (response.config.url.includes('/avatars/')) {
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'image/jpeg'
      });
      return { data: URL.createObjectURL(blob) };
    }
    return response;
  },
  error => {
    // 如果是头像请求的错误，不处理401
    if (error.config.url.includes('/avatars/')) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request; 