import React, { useState, useEffect } from 'react';
import { Input, Select, Radio, Button, Tabs, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './SideBar.css';
import { userApi } from '../api/user';

const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [recentProjects, setRecentProjects] = useState([]);

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
                style={{ width: '50%' }}
                onChange={value => setSelectedTemplate(value)}
              >
                <Option value="python">Python</Option>
                <Option value="c">C</Option>
                <Option value="java">Java</Option>
              </Select>
              </div>
    <div className="form-right">
      <Input
        placeholder="项目标题"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="project-title-input dark"
      />
      <div className="privacy-options">
  <Radio.Group
    value={isPublic}
    onChange={(e) => setIsPublic(e.target.value)}
  >
    <Radio value={true}>
      公开
      <div className="privacy-description">
        任何人都可以查看和分享这个项目。
      </div>
    </Radio>
    <Radio value={false}>
      隐私
      <div className="privacy-description">
        只有您可以查看和编辑这个项目。
      </div>
    </Radio>
  </Radio.Group>

        </div>
    </div>
  </div>
  
  <div className="button-container">
            <Button 
              type="primary" 
              className="create-button"
            >
              CODE
            </Button>
          </div>
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
