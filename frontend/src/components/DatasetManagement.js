import React, { useState, useEffect } from 'react';
import { Card, List, Button, Upload, Input, Tag, Space, message, Modal } from 'antd';
import { UploadOutlined, SearchOutlined, LikeOutlined, DownloadOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import request from '../utils/request';
import './DatasetManagement.css';

const { Search } = Input;

const DatasetManagement = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 获取数据集列表
  const fetchDatasets = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const response = await request.get('/api/datasets', {
        params: {
          page,
          size
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        const { content, totalElements, number, size } = response.data.data;
        setDatasets(content || []);
        setPagination({
          current: number + 1,
          pageSize: size,
          total: totalElements
        });
      } else {
        message.error(response.data.message || '获取数据集列表失败');
      }
    } catch (error) {
      console.error('获取数据集列表失败:', error);
      message.error('获取数据集列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // 上传数据集
  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('description', '数据集描述');

      const response = await request.post('/api/datasets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        message.success('上传成功');
        onSuccess(response, file);
        fetchDatasets(pagination.current - 1, pagination.pageSize);
      } else {
        message.error(response.data.message || '上传失败');
        onError(new Error('上传失败'));
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败: ' + (error.response?.data?.message || error.message || '未知错误'));
      onError(error);
    }
  };

  // 搜索数据集
  const handleSearch = async (value) => {
    try {
      setLoading(true);
      const response = await request.get(`/api/datasets/search`, {
        params: {
          keyword: value,
          page: 0,
          size: pagination.pageSize
        }
      });
      
      if (response.data.success) {
        const { content, totalElements, number, size } = response.data.data;
        setDatasets(content || []);
        setPagination({
          current: number + 1,
          pageSize: size,
          total: totalElements
        });
      } else {
        message.error('搜索失败');
      }
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 查看数据集详情
  const handleView = (dataset) => {
    setSelectedDataset(dataset);
    setModalVisible(true);
  };

  // 下载数据集
  const handleDownload = async (datasetId) => {
    try {
      const response = await request.get(`/api/datasets/${datasetId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dataset-${datasetId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('下载开始');
    } catch (error) {
      message.error('下载失败');
    }
  };

  return (
    <div className="dataset-container">
      <div className="dataset-header">
        <h1>数据集广场</h1>
        <p>发现、分享和使用高质量数据集</p>
      </div>

      <div className="dataset-actions">
        <Space size="large">
          <Search
            placeholder="搜索数据集..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Upload
            name="file"
            customRequest={handleUpload}
            showUploadList={false}
            onChange={(info) => {
              if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
                fetchDatasets();
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
              }
            }}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              上传数据集
            </Button>
          </Upload>
        </Space>
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={datasets}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            fetchDatasets(page - 1, pageSize);
          }
        }}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              className="dataset-card"
              actions={[
                <Button type="link" onClick={() => handleView(item)}>
                  <EyeOutlined /> 查看
                </Button>,
                <Button type="link" onClick={() => handleDownload(item.id)}>
                  <DownloadOutlined /> 下载
                </Button>,
                <Space>
                  <LikeOutlined /> {item.likes}
                </Space>,
                <Space>
                  <CommentOutlined /> {item.comments}
                </Space>
              ]}
            >
              <Card.Meta
                title={item.name}
                description={
                  <>
                    <p className="dataset-description">{item.description}</p>
                    <Space wrap>
                      {item.tags?.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                    <div className="dataset-info">
                      <span>上传者: {item.uploaderName}</span>
                      <span>上传时间: {new Date(item.uploadTime).toLocaleDateString()}</span>
                    </div>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="数据集详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            onClick={() => handleDownload(selectedDataset?.id)}
          >
            下载数据集
          </Button>
        ]}
        width={720}
      >
        {selectedDataset && (
          <div className="dataset-detail">
            <h2>{selectedDataset.name}</h2>
            <p>{selectedDataset.description}</p>
            <div className="dataset-stats">
              <div>
                <DownloadOutlined /> 下载次数：{selectedDataset.downloads}
              </div>
              <div>
                <LikeOutlined /> 点赞数：{selectedDataset.likes}
              </div>
              <div>
                <CommentOutlined /> 评论数：{selectedDataset.comments}
              </div>
            </div>
            <div className="dataset-meta">
              <p>上传者：{selectedDataset.uploaderName}</p>
              <p>上传时间：{new Date(selectedDataset.uploadTime).toLocaleString()}</p>
              <p>文件大小：{(selectedDataset.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DatasetManagement; 