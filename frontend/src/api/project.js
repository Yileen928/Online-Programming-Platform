import request from '../utils/request';

export const projectApi = {
  // 获取项目列表
  getProjects: () => {
    return request({
      url: '/api/projects',
      method: 'get'
    });
  },

  // 创建新项目
  createProject: (data) => {
    return request({
      url: '/api/projects',
      method: 'post',
      data: {
        ...data,
        createTime: new Date().toISOString()
      }
    });
  },

  // 更新项目
  updateProject: (id, data) => {
    return request({
      url: `/api/projects/${id}`,
      method: 'put',
      data
    });
  },

  // 删除项目
  deleteProject: (id) => {
    return request({
      url: `/api/projects/${id}`,
      method: 'delete'
    });
  },

  // 批量删除项目
  batchDeleteProjects: (projectIds) => {
    return request({
      url: '/api/projects/batch',
      method: 'delete',
      data: { projectIds }
    });
  }
}; 