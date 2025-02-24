import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true
});

instance.interceptors.request.use(
  config => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default instance; 