import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Radio, Button, Tabs, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import SideBar from './home/SideBar';
import './Home.css';
import { userApi } from '../api/user';

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const templates = [
    { key: 'python', label: 'Python' },
    { key: 'c', label: 'C' },
    { key: 'java', label: 'Java' }
  ];

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        setLoading(true);
        const response = await userApi.getRecentProjects();
        setRecentProjects(response || []);
      } catch (error) {
        console.error('获取最近项目失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  return (
    <Layout className="home-layout dark">
      <SideBar />
      <Layout>
        <Header className="home-header dark">
          <Search 
            placeholder="search for projects" 
            className="search-input"
          />
          <div className="header-icons">
            <span>📅</span>
            <span>❓</span>
            <span>🔔</span>
            <span className="avatar">👤</span>
          </div>
        </Header>
        <Content className="home-content dark">
          <Tabs
            defaultActiveKey="template"
            items={[
              {
                key: 'template',
                label: '选择模版',
                children: (
                  <div className="template-content">
                    <div className="project-form">
                      <div className="form-left">
                        <Select
                          placeholder="选择模版"
                          style={{ width: '100%' }}
                          onChange={value => setSelectedTemplate(value)}
                        >
                          {templates.map(template => (
                            <Option key={template.key} value={template.key}>
                              {template.label}
                            </Option>
                          ))}
                        </Select>
                        <Input
                          placeholder="项目标题"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="project-title-input dark"
                        />
                      </div>
                      <div className="form-right">
                        <div className="privacy-options">
                          <Radio.Group
                            value={isPublic}
                            onChange={(e) => setIsPublic(e.target.value)}
                          >
                            <Radio value={true}>公开</Radio>
                            <Radio value={false}>隐私</Radio>
                          </Radio.Group>
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="primary" 
                      className="create-button"
                    >
                      CODE
                    </Button>
                  </div>
                ),
              },
              {
                key: 'github',
                label: '从GitHub上拉取',
                children: <div>GitHub导入功能</div>,
              },
            ]}
          />
          
          <div className="recent-projects-container">
            <h3>最近的项目</h3>
            <div className="recent-projects-grid">
              {loading ? (
                <div className="loading-projects">加载中...</div>
              ) : recentProjects.length > 0 ? (
                recentProjects.map(project => (
                  <Card 
                    key={project.id}
                    className="recent-project-card"
                    bordered={false}
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div className="project-icon">—</div>
                    <div className="project-info">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <span className="project-time">{project.lastModified}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="no-projects">暂无最近项目</div>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home; 