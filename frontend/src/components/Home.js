import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, Card, Radio, Space, message } from 'antd';
import { userApi } from '../api/user';
import SideBar from './home/SideBar';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const { Header, Content } = Layout;
const { Search } = Input;

// ============== Path Implementation ==============
const PATHS = {
  LOGIN: '/login',
  PROFILE: '/profile',
  PROJECT_DETAIL: (id) => `/project/${id}`
};

const Home = () => {
  const navigate = useNavigate();

  // ============== State ==============
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [privacyType, setPrivacyType] = useState('public');
  const [projectTitle, setProjectTitle] = useState('');
  const [username, setUsername] = useState('');

  // ============== API Calls ==============
  const fetchRecentProjects = async () => {
    try {
      const result = await userApi.getRecentProjects();
      setRecentProjects(result || []);
    } catch (error) {
      console.log('获取最近项目失败，可能是新用户');
      setRecentProjects([]);
    }
  };

  // ============== Handlers ==============
  const handlePrivacyChange = (e) => {
    setPrivacyType(e.target.value);
  };

  const handleProjectTitleChange = (value) => {
    setProjectTitle(value);
  };

  const handleCreateProject = async () => {
    if (!projectTitle) {
      message.warning('请输入项目标题');
      return;
    }

    try {
      const result = await userApi.createProject({
        title: projectTitle,
        isPrivate: privacyType === 'private'
      });
      message.success('项目创建成功');
      navigate(PATHS.PROJECT_DETAIL(result.id));
    } catch (error) {
      message.error('项目创建失败');
    }
  };

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      navigate(PATHS.LOGIN);
    } catch (error) {
      message.error('登出失败');
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(PATHS.PROJECT_DETAIL(projectId));
  };

  // ============== Effects ==============
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
    fetchRecentProjects();
  }, []);

  return (
    <Layout className="home-layout">
      <SideBar onLogout={handleLogout} />
      <Layout>
        <Header className="home-header">
          <div className="header-content">
            <Search
              placeholder="search for projects"
              className="search-input"
            />
            <div className="user-info">
              欢迎, {username}
            </div>
          </div>
        </Header>
        <Content className="home-content">
          <div className="project-section">
            <div className="section-header">
              <Space>
                <Button type="text">选择模版</Button>
                <Button type="text">从GitHub上拉取</Button>
              </Space>
            </div>
            
            <div className="template-section">
              <div className="template-header">
                <span>模版</span>
                <Search
                  placeholder="请输入项目标题"
                  className="project-title-input"
                  value={projectTitle}
                  onChange={(e) => handleProjectTitleChange(e.target.value)}
                />
              </div>
              
              <div className="privacy-settings">
                <span>隐私</span>
                <Radio.Group value={privacyType} onChange={handlePrivacyChange}>
                  <Radio value="public">
                    公开
                    <div className="radio-description">任何人都可以查看和分享这个项目。</div>
                  </Radio>
                  <Radio value="private">
                    隐私
                    <div className="radio-description">只有您和您分享的人可以查看这个项目。</div>
                  </Radio>
                </Radio.Group>
              </div>
              
              <Button type="primary" block className="create-button" onClick={handleCreateProject}>
                CODE
              </Button>
            </div>
          </div>
          
          <div className="recent-projects">
            <h3>最近的项目</h3>
            <div className="projects-grid">
              {loading ? (
                <div className="loading-projects">加载中...</div>
              ) : recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="project-card"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <span className="project-time">{project.lastModified}</span>
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