import React, { useState, useEffect, useRef } from 'react';
import { Input, Select, Radio, Button, Tabs, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { userApi } from '../api/user';
import GitHubConnect from './github/GitHubConnect';
import RepoList from './github/RepoList';
import CreateRepo from './github/CreateRepo';
import GiteeConnect from '../components/gitee/GiteeConnect';
import GiteeRepoList from '../components/gitee/GiteeRepoList';

const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const repoListRef = React.useRef();
  const [githubConnected, setGithubConnected] = useState(false);
  const [giteeConnected, setGiteeConnected] = useState(false);
  const githubRepoListRef = useRef();
  const giteeRepoListRef = useRef();

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      const response = await userApi.getRecentProjects();
      setRecentProjects(response || []);
    } catch (error) {
      console.error('获取最近项目失败:', error);
    }
  };

  const handleGitHubConnect = () => {
    setGithubConnected(true);
    if (githubRepoListRef.current) {
      githubRepoListRef.current.fetchRepos();
    }
  };

  const handleGiteeConnect = () => {
    setGiteeConnected(true);
    if (giteeRepoListRef.current) {
      giteeRepoListRef.current.fetchRepos();
    }
  };

  const items = [
    {
      key: 'template',
      label: '选择模版',
      children: (
        <div className="template-content">
          <div className="template-form">
            <div className="form-left">
              <Select
                placeholder="选择模版"
                style={{ width: '100%' }}
                onChange={value => setSelectedTemplate(value)}
              >
                <Option value="python">Python</Option>
                <Option value="c">C</Option>
                <Option value="java">Java</Option>
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
      children: (
        <div className="github-content">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              {!githubConnected ? (
                <GitHubConnect onConnectSuccess={handleGitHubConnect} />
              ) : (
                <RepoList ref={githubRepoListRef} />
              )}
            </Col>
            <Col span={12}>
              <CreateRepo />
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'gitee',
      label: '从Gitee上拉取',
      children: (
        <div className="gitee-content">
          {!giteeConnected ? (
            <GiteeConnect onConnectSuccess={handleGiteeConnect} />
          ) : (
            <GiteeRepoList ref={giteeRepoListRef} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="home-content dark">
      <div className="header-search">
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
      </div>

      <Tabs items={items} />
      
      <div className="recent-projects">
        <h3>最近的项目</h3>
        <div className="projects-grid">
          {recentProjects.map(project => (
            <Card 
              key={project.id}
              className="project-card"
              bordered={false}
            >
              <div className="project-icon">—</div>
              <div className="project-info">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <span className="project-time">{project.lastModified}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 