import request from './request';
import axios from 'axios';

export const userApi = {
  // 用户登录
  login: (data) => {
    console.log('Sending login request with data:', data);
    return request({
      url: '/api/auth/login',  // 修改为正确的路径
      method: 'post',
      data
    });
  },

  // 获取用户信息
  getUserInfo: () => {
    return request
        .get('/api/user/info')
        .then((response) => response.data) // 返回数据
        .catch((error) => {
          throw error.response?.data || { message: '获取用户信息失败' };
        });
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
    return request
        .get('/api/user/recent-projects')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '获取最近项目失败' };
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
  logout: () => {
    return request
        .post('/api/user/logout')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '注销失败' };
        });
  },

  // 检查用户认证状态
  checkAuth: () => {
    return request
        .get('/api/user/auth-status')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '认证状态检查失败' };
        });
  },

  createProject: async (projectData) => {
    try {
      console.log('Creating project with data:', projectData);
      const response = await request.post('/api/projects', projectData);
      console.log('Project creation response:', response);
      return response;
    } catch (error) {
      console.error('Project creation error:', error);
      throw error;
    }
  },
};