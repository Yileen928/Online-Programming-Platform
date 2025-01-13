import React, { useState } from 'react';
import { Layout, Table, Button, Space, Tag, Input } from 'antd';
import SideBar from './home/SideBar';
import './ProjectManagement.css';

const { Header, Content } = Layout;
const { Search } = Input;

const ProjectManagement = () => {
  const [projects] = useState([
    {
      key: '1',
      name: '支付功能开发',
      description: '项目描述',
      lastModified: '2024-02-22',
      type: 'py'
    },
    {
      key: '2',
      name: '商品列表展示',
      description: '项目描述',
      lastModified: '2024-02-10',
      type: 'py'
    },
    {
      key: '3',
      name: '自动化测试用例编写',
      description: '项目描述',
      lastModified: '2024-02-28',
      type: 'py'
    }
  ]);

  return (
    <Layout className="project-management-layout dark">
      <SideBar />
      <Layout>
        <Header className="project-header dark">
          <Search 
            placeholder="search for projects" 
            className="search-input"
          />
          <div className="header-icons">
            <span>📅</span>
            <span>❓</span>
            <span>🔔</span>
            <Button type="primary" className="new-project-btn">+</Button>
          </div>
        </Header>
        <Content className="project-content">
          <div className="project-list">
            {projects.map(project => (
              <div key={project.key} className="project-item">
                <div className="project-type">{project.type}</div>
                <div className="project-info">
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                </div>
                <div className="project-date">{project.lastModified}</div>
              </div>
            ))}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectManagement; 