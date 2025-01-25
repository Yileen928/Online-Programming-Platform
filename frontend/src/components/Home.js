import React, { useState, useEffect } from 'react';
import { Input, Select, Radio, Button, Tabs, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { userApi } from '../api/user';
import { useMessage } from '../hooks/useMessage';

const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);
  const messageApi = useMessage();

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      const response = await userApi.getRecentProjects();
      console.log('Recent projects:', response);
      setRecentProjects(response || []);
    } catch (error) {
      messageApi.error('获取最近项目失败');
    }
  };

  const handleCreateProject = async () => {
    try {
      if (!selectedTemplate || !projectName.trim()) {
        messageApi.error('请选择模板并输入项目名称');
        return;
      }

      const userId = localStorage.getItem('userId');
      const response = await userApi.createProject({
        name: projectName,
        template: selectedTemplate,
        isPublic: isPublic,
        userId: userId
      });

      if (response.success) {
        messageApi.success('项目创建成功');
        navigate(`/projects/${response.projectId}`);
      }
    } catch (error) {
      messageApi.error(error.message || '创建项目失败');
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
            onClick={handleCreateProject}
            disabled={!selectedTemplate || !projectName.trim()}
          >
            创建项目
          </Button>
        </div>
      ),
    },
    {
      key: 'github',
      label: '从GitHub上拉取',
      children: <div>GitHub导入功能</div>,
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
        <h3>最近的项目 ({recentProjects.length})</h3>
        <div className="projects-grid">
          {recentProjects && recentProjects.length > 0 ? (
            recentProjects.map(project => (
              <Card 
                key={project.id}
                className="project-card"
                bordered={false}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="project-icon">
                  {project.template === 'python' ? '🐍' : 
                   project.template === 'java' ? '☕' : 
                   project.template === 'c' ? '🔧' : '📄'}
                </div>
                <div className="project-info">
                  <h4>{project.name}</h4>
                  <p>模板: {project.template}</p>
                  <span className="project-time">
                    {new Date(project.createdAt).toLocaleString()}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <div>暂无项目</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 