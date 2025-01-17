import React, { useState } from 'react';
import { Card, List, Button, Upload, Input, Tag, Space, message } from 'antd';
import { UploadOutlined, SearchOutlined, LikeOutlined, DownloadOutlined, CommentOutlined } from '@ant-design/icons';
import './DatasetManagement.css';

const { Search } = Input;

const DatasetManagement = () => {
  const [datasets, setDatasets] = useState([
    {
      id: 1,
      title: 'MNIST手写数字数据集',
      description: '包含60,000个训练样本和10,000个测试样本的手写数字图像',
      uploader: 'Alice',
      uploadTime: '2024-03-15',
      tags: ['图像', '机器学习', '分类'],
      likes: 156,
      downloads: 1289,
      comments: 23
    }
  ]);

  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    }
  };

  const handleSearch = (value) => {
    console.log('搜索:', value);
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
            name="dataset"
            action="/api/datasets/upload"
            onChange={handleUpload}
            showUploadList={false}
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
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              className="dataset-card"
              actions={[
                <Space>
                  <LikeOutlined /> {item.likes}
                </Space>,
                <Space>
                  <DownloadOutlined /> {item.downloads}
                </Space>,
                <Space>
                  <CommentOutlined /> {item.comments}
                </Space>
              ]}
            >
              <Card.Meta
                title={item.title}
                description={
                  <>
                    <p>{item.description}</p>
                    <Space wrap>
                      {item.tags.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                    <div className="dataset-info">
                      <span>上传者: {item.uploader}</span>
                      <span>上传时间: {item.uploadTime}</span>
                    </div>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default DatasetManagement; 