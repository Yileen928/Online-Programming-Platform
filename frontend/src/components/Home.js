import React, { useState, useEffect } from 'react';
import { Layout, Input, Card, Select, Radio, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user';
import SideBar from './home/SideBar';
import './Home.css';

const { Header, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleCreateProject = () => {
    if (!selectedLanguage) {
      message.error('请选择编程语言');
      return;
    }
    if (!projectName.trim()) {
      message.error('请输入项目名称');
      return;
    }

    // 导航到编译界面，带上必要的参数
    navigate(`/editor`, {
      state: {
        language: selectedLanguage,
        projectName: projectName,
        isPublic: isPublic
      }
    });
  };

  return (
    <Layout className="home-layout">
      <SideBar />
      <Layout>
        <Header className="home-header">
          <div className="header-content">
            <Search placeholder="搜索项目" className="search-input" />
            <div className="user-info">欢迎, {username}</div>
          </div>
        </Header>
        <Content className="home-content">
          <div className="template-section">
            <h2>创建新项目</h2>
            <div className="language-selection">
              <h3>选择编程语言</h3>
              <Select
                style={{ width: 200 }}
                placeholder="选择编程语言"
                onChange={handleLanguageChange}
              >
                <Option value="python">Python</Option>
                <Option value="java">Java</Option>
                <Option value="c">C 语言</Option>
              </Select>
            </div>

            {selectedLanguage && (
              <div className="project-config">
                <div className="project-name">
                  <h3>项目名称</h3>
                  <Input
                    placeholder="输入项目名称"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    style={{ width: 300 }}
                  />
                </div>

                <div className="privacy-settings">
                  <h3>项目权限</h3>
                  <Radio.Group
                    value={isPublic}
                    onChange={(e) => setIsPublic(e.target.value)}
                  >
                    <Radio value={true}>公开</Radio>
                    <Radio value={false}>私有</Radio>
                  </Radio.Group>
                </div>

                <Button
                  type="primary"
                  className="create-button"
                  onClick={handleCreateProject}
                >
                  创建项目
                </Button>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home; 