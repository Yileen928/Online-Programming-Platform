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
  },

  // 获取个人项目列表
  getPersonalProjects: () => {
    return request.get('/api/projects/personal');
  },

  // 获取团队项目列表
  getTeamProjects: () => {
    return request.get('/api/projects/team');
  },

  // 获取数据集列表
  getDatasets: () => {
    return request.get('/api/datasets');
  }
};
