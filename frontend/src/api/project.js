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
    const token = localStorage.getItem('token');
    return request({
      url: '/api/projects',
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
  },

  // 获取项目文件列表
  getProjectFiles: (projectId) => {
    return request({
      url: `/api/projects/${projectId}/files`,
      method: 'get'
    });
  },

  // 获取文件内容
  getFileContent: (projectId, fileId) => {
    return request({
      url: `/api/projects/${projectId}/files/${fileId}/content`,
      method: 'get'
    });
  },

  // 保存文件内容
  saveFileContent: (projectId, fileId, content) => {
    return request({
      url: `/api/projects/${projectId}/files/${fileId}/content`,
      method: 'put',
      data: content
    });
  }
}; 