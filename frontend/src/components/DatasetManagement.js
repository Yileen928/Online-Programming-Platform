import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Tag, Space, Empty } from 'antd';
import { userApi } from '../api/user';
import SideBar from './home/SideBar';
import './DatasetManagement.css';

const { Header, Content } = Layout;
const { Search } = Input;

const DatasetManagement = () => {
  // ============== State ==============
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const datasetTags = ['医疗数据集', '旅游数据集', '电影数据集'];

  // ============== API Calls ==============
  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const data = await userApi.getDatasets();
      setDatasets(data || []);
    } catch (error) {
      console.error('获取数据集失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============== Handlers ==============
  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // ============== Effects ==============
  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <Layout className="dataset-layout">
      <SideBar onLogout={handleLogout} />
      <Layout>
        <Header className="dataset-header">
          <Search
            placeholder="search datasets"
            className="search-input"
          />
          <div className="add-button">+</div>
        </Header>
        <Content className="dataset-content">
          <div className="dataset-tags">
            {datasetTags.map(tag => (
              <Tag
                key={tag}
                className={`dataset-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag} ×
              </Tag>
            ))}
          </div>
          
          <div className="datasets-grid">
            {loading ? (
              <div className="loading-datasets">加载中...</div>
            ) : datasets.length > 0 ? (
              datasets.map((dataset) => (
                <Card key={dataset.id} className="dataset-card">
                  <h3>{dataset.title}</h3>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div className="dataset-info">
                      <span>更新时间: {dataset.updateTime}</span>
                    </div>
                    <div className="dataset-info">
                      <span>文件类型: {dataset.fileType}</span>
                    </div>
                    <div className="dataset-actions">
                      <span>▲</span>
                      <span>9</span>
                      <span>▼</span>
                    </div>
                  </Space>
                </Card>
              ))
            ) : (
              <div className="empty-datasets">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据集"
                  className="empty-content"
                />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DatasetManagement; 