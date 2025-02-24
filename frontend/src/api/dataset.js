import request from '../utils/request';

export const datasetApi = {
  uploadDataset: async (file, name, description) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);

    try {
      const response = await request({
        url: '/api/datasets/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // 确保添加 token
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}; 