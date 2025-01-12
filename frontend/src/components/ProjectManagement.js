import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Tag, message } from 'antd';
import { userApi } from '../api/user';
import SideBar from './home/SideBar';
import './ProjectManagement.css';

const { Header, Content } = Layout;
const { Search } = Input;

// ============== Path Implementation ==============
const PATHS = {
  PROJECT_DETAIL: (id) => `/project/${id}`
};

const ProjectManagement = () => {
  // ============== State ==============
  const [personalProjects, setPersonalProjects] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [personalSearchValue, setPersonalSearchValue] = useState('');
  const [teamSearchValue, setTeamSearchValue] = useState('');

  // ============== API Calls ==============
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [personalData, teamData] = await Promise.all([
        userApi.getPersonalProjects(),
        userApi.getTeamProjects()
      ]);
      setPersonalProjects(personalData);
      setTeamProjects(teamData);
    } catch (error) {
      message.error('获取项目列表失败');
      console.error('获取项目列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============== Handlers ==============
  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      message.error('登出失败');
    }
  };

  const handleProjectClick = (projectId) => {
    window.location.href = PATHS.PROJECT_DETAIL(projectId);
  };

  // ============== Effects ==============
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Layout className="project-management-layout">
      <SideBar onLogout={handleLogout} />
      <Layout>
        <Header className="project-management-header">
          <Search
            placeholder="search for projects"
            className="search-input"
          />
        </Header>
        <Content className="project-management-content">
          <div className="project-section">
            <div className="section-header">
              <h2>个人项目</h2>
              <Search
                placeholder="请输入个人项目名称"
                className="section-search"
                value={personalSearchValue}
                onChange={e => setPersonalSearchValue(e.target.value)}
              />
            </div>
            <div className="projects-grid">
              {loading ? (
                <div className="loading-projects">加载中...</div>
              ) : personalProjects.length > 0 ? (
                personalProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="project-card"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Tag color={project.status === '开发' ? 'blue' : 'green'}>
                      {project.status}
                    </Tag>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <span className="project-time">{project.lastModified}</span>
                  </Card>
                ))
              ) : (
                <div className="no-projects">暂无个人项目</div>
              )}
            </div>
          </div>

          <div className="project-section">
            <div className="section-header">
              <h2>团队项目</h2>
              <Search
                placeholder="请输入团队项目名称"
                className="section-search"
                value={teamSearchValue}
                onChange={e => setTeamSearchValue(e.target.value)}
              />
            </div>
            <div className="projects-grid">
              {loading ? (
                <div className="loading-projects">加载中...</div>
              ) : teamProjects.length > 0 ? (
                teamProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="project-card"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Tag color={project.status === '开发' ? 'blue' : 'green'}>
                      {project.status}
                    </Tag>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                    <span className="project-time">{project.lastModified}</span>
                  </Card>
                ))
              ) : (
                <div className="no-projects">暂无团队项目</div>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectManagement; 