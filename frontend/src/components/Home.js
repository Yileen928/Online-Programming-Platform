import React, { useState, useEffect, useRef } from 'react';
import { Input, Select, Radio, Button, Tabs, Card, Row, Col, Tag, message, Modal, Popconfirm, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import './SideBar.css';
import { userApi } from '../api/user';
import GitHubConnect from './github/GitHubConnect';
import RepoList from './github/RepoList';
import CreateRepo from './github/CreateRepo';
import GiteeConnect from '../components/gitee/GiteeConnect';
import GiteeRepoList from '../components/gitee/GiteeRepoList';
import CreateGiteeRepo from '../components/gitee/CreateGiteeRepo';
import { useMessage } from '../hooks/useMessage';
import { projectApi } from '../api/project';
import { 
  JavaOutlined, 
  PythonOutlined,
  JavaScriptOutlined,
  CodeOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';

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
  const messageApi = useMessage();
  const [projects, setProjects] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projectLanguage, setProjectLanguage] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [sortOrder, setSortOrder] = useState('recent');

  useEffect(() => {
    fetchRecentProjects();
    fetchProjects();
  }, []);

  const fetchRecentProjects = async () => {try {const response = await userApi.getRecentProjects();setRecentProjects(response || []);} catch (error) {messageApi.error('获取最近项目失败');}};
  const fetchProjects = async () => {try { const response = await projectApi.getProjects();
  const projectList = response.data?.data || [];
  const uniqueProjects = Array.from(new Map(projectList.map(project => [project.id, project])).values());setProjects(uniqueProjects);} catch (error) {console.error('获取项目列表失败:', error);messageApi.error('获取项目列表失败');}};
  const handleCreateProject = async () => {try {if (!selectedTemplate || !projectName.trim()) {
messageApi.error('请选择模板并输入项目名称');
        return;
      }

      const response = await projectApi.createProject({
        name: projectName,
        template: selectedTemplate,
        isPublic: isPublic
      });

      if (response.data?.success) {
        messageApi.success('项目创建成功');
        // 创建成功后直接导航到编辑器页面
        navigate(`/projects/${response.data.data.id}/editor`);
        // 重置表单
        setProjectName('');
        setSelectedTemplate(null);
        setIsModalVisible(false);
      } else {
        throw new Error(response.data?.message || '创建失败');
      }
    } catch (error) {
      console.error('创建项目失败:', error);
      messageApi.error(error.message || '创建项目失败');
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

  // 获取语言图标
  const getLanguageIcon = (language) => {
    switch (language?.toLowerCase()) {
      case 'java':
        return <JavaOutlined />;
      case 'python':
        return <PythonOutlined />;
      case 'javascript':
        return <JavaScriptOutlined />;
      default:
        return <CodeOutlined />;
    }
  };

  // 获取语言标签颜色
  const getLanguageColor = (language) => {
    switch (language?.toLowerCase()) {
      case 'java':
        return '#b07219';
      case 'python':
        return '#3572A5';
      case 'javascript':
        return '#f1e05a';
      default:
        return '#666';
    }
  };

  const showCreateModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setProjectName('');
    setProjectLanguage('');
    setEditingProject(null);
  };

  const handleCreate = async () => {
    if (!projectName.trim() || !projectLanguage) {
      messageApi.error('请输入项目名称并选择编程语言');
      return;
    }

    try {
      const response = await projectApi.createProject({
        name: projectName.trim(),
        language: projectLanguage,
        isPublic: isPublic
      });

      if (response.data?.success) {
        messageApi.success('创建成功');
        setIsModalVisible(false);
        setProjectName('');
        setProjectLanguage('');
        fetchProjects(); // 刷新项目列表
      }
    } catch (error) {
      console.error('创建项目失败:', error);
      messageApi.error(error.message || '创建失败，请重试');
    }
  };

  // 删除项目
  const handleDelete = async (project, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    try {
      await projectApi.deleteProject(project.id);
      messageApi.success('删除成功');
      fetchProjects();
    } catch (error) {
      console.error('删除项目失败:', error);
      messageApi.error('删除失败，请重试');
    }
  };

  // 打开编辑模态框
  const showEditModal = (project, e) => {
    e.stopPropagation(); // 阻止事件冒泡
    setEditingProject(project);
    setProjectName(project.name);
    setProjectLanguage(project.language);
    setIsPublic(project.isPublic);
    setIsModalVisible(true);
  };

  // 处理编辑或创建
  const handleOk = async () => {
    if (!projectName.trim() || !projectLanguage) {
      messageApi.error('请输入项目名称并选择编程语言');
      return;
    }

    try {
      if (editingProject) {
        // 编辑现有项目
        await projectApi.updateProject(editingProject.id, {
          name: projectName.trim(),
          language: projectLanguage,
          isPublic: isPublic
        });
        messageApi.success('更新成功');
      } else {
        // 创建新项目
        await projectApi.createProject({
          name: projectName.trim(),
          language: projectLanguage,
          isPublic: isPublic
        });
        messageApi.success('创建成功');
      }
      
      setIsModalVisible(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('操作失败:', error);
      messageApi.error(error.message || '操作失败，请重试');
    }
  };

  // 重置表单
  const resetForm = () => {
    setProjectName('');
    setProjectLanguage('');
    setIsPublic(true);
    setEditingProject(null);
  };

  // 获取并处理项目列表
  useEffect(() => {
    const processProjects = (projects) => {
      // 根据创建时间排序
      const sorted = [...projects].sort((a, b) => {
        if (sortOrder === 'recent') {
          return new Date(b.createTime) - new Date(a.createTime);
        }
        return new Date(a.createTime) - new Date(b.createTime);
      });

      // 根据选择的语言过滤
      if (selectedLanguage === 'all') {
        setFilteredProjects(sorted);
      } else {
        const filtered = sorted.filter(
          project => project.language?.toLowerCase() === selectedLanguage.toLowerCase()
        );
        setFilteredProjects(filtered);
      }
    };

    processProjects(projects);
  }, [projects, selectedLanguage, sortOrder]);

  const items = [
    {
        key: 'template',
        label: '选择模版',
        children: (
          
                    <div className="template-content">
           
              <div className="form-left">
                <Select className='choose_m'
                  placeholder="选择模版"
                  style={{ width: '100%' }}
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
                    <Radio value={true}>公开</Radio>
                    <Radio value={false}>隐私</Radio>
                  </Radio.Group>
                </div>
                <Button 
                  type="primary" 
                  className="create-button" 
                  onClick={handleCreateProject} 
                  disabled={!selectedTemplate || !projectName.trim()}
                >
                  {!selectedTemplate || !projectName.trim() ? 'CODE' : '创建项目'}
                </Button>

            </div>
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
                <>
                  <CreateRepo onSuccess={() => githubRepoListRef.current?.fetchRepos()} />
                  <RepoList ref={githubRepoListRef} />
                </>
              )}
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
            <>
              <CreateGiteeRepo onSuccess={() => giteeRepoListRef.current?.fetchRepos()} />
              <GiteeRepoList ref={giteeRepoListRef} />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className='fa-con'>
      <div className='background-home'>
       <div className="home-content dark">
      <div className="header-search">
        <Search 
          placeholder="search for projects" 
          className="search-input"
        />
        <div className="header-icons">
          <span>📅</span>
          <span>❓</span>
          <span>��</span>
          <Avatar.Group
            max={{ count: 3 }}
          >
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male&n=1" />
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=female&n=1" />
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male&n=2" />
          </Avatar.Group>
        </div>
      </div>
      
      <Tabs items={items} />
       </div>  
      </div>
      
      <div className="recent-projects">
        <h3>最近的项目 ({recentProjects.length})</h3>
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <Card 
              key={project.id} 
              className="project-card"
              onClick={() => navigate(`/projects/${project.id}/editor`)}
              hoverable
              extra={
                <div className="card-actions" onClick={e => e.stopPropagation()}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => showEditModal(project, e)}
                  />
                  <Popconfirm
                    title="确定要删除这个项目吗？"
                    onConfirm={(e) => handleDelete(project, e)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </Popconfirm>
                </div>
              }
            >
              <div className="project-info">
                <h4>{project.name}</h4>
                <Tag 
                  icon={getLanguageIcon(project.language)}
                  color={getLanguageColor(project.language)}
                  style={{ marginBottom: '8px' }}
                >
                  {project.language || '未知语言'}
                </Tag>
                <p>{project.description}</p>
                <span className="project-time">
                  {new Date(project.createTime).toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        title={editingProject ? "编辑项目" : "创建新项目"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingProject ? "更新" : "创建"}
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="项目名称"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          
          <Select
            style={{ width: '100%', marginBottom: 16 }}
            placeholder="选择编程语言"
            value={projectLanguage}
            onChange={value => setProjectLanguage(value)}
          >
            <Option value="java">Java</Option>
            <Option value="python">Python</Option>
            <Option value="javascript">JavaScript</Option>
            <Option value="c">C</Option>
          </Select>

          <Radio.Group 
            value={isPublic} 
            onChange={e => setIsPublic(e.target.value)}
          >
            <Radio value={true}>公开</Radio>
            <Radio value={false}>私有</Radio>
          </Radio.Group>
        </div>
      </Modal>
      </div>
  );
};

export default Home; 
