import request from './request';

export const userApi = {
  // 用户登录
  login: (data) => {
    return request.post('/api/user/login', data);
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return request.get('/api/user/info');
  },
  
  // 更新用户信息
  updateUser: (data) => {
    return request.put('/api/user/update', data);
  },

  // 获取用户最近的项目
  getRecentProjects: () => {
    return request.get('/api/user/recent-projects');
  }
};
