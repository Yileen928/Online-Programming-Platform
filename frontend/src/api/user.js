import request from '../utils/request';
import axios from 'axios';

export const userApi = {
  // 登录方法
  login: async (data) => {
    try {
      const response = await request({
        url: '/api/auth/login',
        method: 'post',
        data
      });
      if (response.data.success) {
        // 保存token和userId
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 获取用户信息
  async getUserInfo(retry = true) {
    try {
      const response = await request.get('/api/users/info');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 && retry) {
        // token 过期，尝试刷新
        try {
          await this.refreshToken();
          // 重试一次
          return await this.getUserInfo(false);
        } catch (refreshError) {
          throw error;
        }
      }
      throw error;
    }
  },

  // 更新用户信息
  updateUser: (data) => {
    return request
        .put('/api/user/update', data)
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '更新用户信息失败' };
        });
  },

  // 获取用户最近的项目
  getRecentProjects: () => {
    return request({
      url: '/api/users/projects',
      method: 'get'
    });
  },

  // 获取个人项目列表
  getPersonalProjects: () => {
    return request
        .get('/api/projects/personal')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '获取个人项目列表失败' };
        });
  },

  // 获取团队项目列表
  getTeamProjects: () => {
    return request
        .get('/api/projects/team')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '获取团队项目列表失败' };
        });
  },

  // 获取数据集列表
  getDatasets: () => {
    return request
        .get('/api/datasets')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '获取数据集列表失败' };
        });
  },

  // 注销用户
  logout: async () => {
    try {
      const response = await request({
        url: '/api/auth/logout',
        method: 'post'
      });
      return response.data;
    } catch (error) {
      // 即使请求失败也要清除本地token
      localStorage.removeItem('token');
      throw error;
    }
  },

  // 检查认证状态
  checkAuth: async () => {
    try {
      const response = await request({
        url: '/api/auth/check',
        method: 'get'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 注册用户
  register: (data) => {
    return request({
      url: '/api/auth/register',
      method: 'post',
      data
    });
  },

  // 创建项目
  createProject: (data) => {
    return request({
      url: '/api/projects',
      method: 'post',
      data
    });
  },

  // 更新个人信息
  updateProfile: async (data) => {
    try {
      const response = await request({
        url: '/api/users/profile',
        method: 'post',
        data: {
          ...data,
          userId: localStorage.getItem('userId') // 添加用户ID
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 修改密码
  changePassword: (data) => {
    return request({
      url: '/api/users/password',
      method: 'post',
      data
    });
  },

  // 更新头像
  updateAvatar: async (formData) => {
    try {
      const response = await request({
        url: '/api/users/avatar',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 上传图片到图床
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('上传失败:', error);
      throw error;
    }
  },

  // 刷新token
  refreshToken: async () => {
    // 实现刷新token的逻辑
  }
};