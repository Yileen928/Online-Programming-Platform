import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, message, Spin } from 'antd';
import CodeEditor from '../../components/CodeEditor';
import { projectApi } from '../../api/project';
import { FileOutlined, SaveOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const ProjectEditor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectFiles();
  }, [projectId]);

  const fetchProjectFiles = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getProjectFiles(projectId);
      if (response.data?.success) {
        setFiles(response.data.data);
        if (response.data.data.length > 0) {
          setCurrentFile(response.data.data[0]);
          await fetchFileContent(response.data.data[0].id);
        }
      }
    } catch (error) {
      message.error('获取项目文件失败');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (fileId) => {
    try {
      const response = await projectApi.getFileContent(projectId, fileId);
      if (response.data?.success) {
        setCode(response.data.data.content);
      }
    } catch (error) {
      message.error('获取文件内容失败');
    }
  };

  const handleFileSelect = async (file) => {
    setCurrentFile(file);
    await fetchFileContent(file.id);
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleSave = async () => {
    try {
      await projectApi.saveFileContent(projectId, currentFile.id, code);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 将文件列表转换为 Menu items 格式
  const getMenuItems = () => {
    return files.map(file => ({
      key: file.id.toString(),
      icon: <FileOutlined />,
      label: file.name,
      onClick: () => handleFileSelect(file)
    }));
  };

  if (loading) {
    return <Spin size="large" className="center-spin" />;
  }

  return (
    <Layout style={{ height: 'calc(100vh - 64px)' }}>
      <Sider width={250} theme="dark" style={{ overflow: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[currentFile?.id?.toString()]}
          style={{ height: '100%', borderRight: 0 }}
          items={getMenuItems()}
        />
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content>
          {currentFile ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSave}
                >
                  保存
                </Button>
              </div>
              <CodeEditor
                language={currentFile.language}
                value={code}
                onChange={handleCodeChange}
              />
            </>
          ) : (
            <div>请选择或创建文件</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectEditor; 