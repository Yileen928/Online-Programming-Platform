import request from '../utils/request';

export const userApi = {
  // 登录方法
  login: async (data) => {
    try {
      const response = await request({
        url: '/api/auth/login',
        method: 'post',
        data
      });
      return response.data;  // 直接返回响应数据
    } catch (error) {
      throw error.response?.data || error;
    }
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
    return request({
      url: '/api/user/projects',
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
  logout: () => {
    return request
        .post('/api/user/logout')
        .then((response) => response.data)
        .catch((error) => {
          throw error.response?.data || { message: '注销失败' };
        });
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
  }
};