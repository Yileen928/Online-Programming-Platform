import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Layout, message } from 'antd';
import Editor from '@monaco-editor/react';
import './Editor.css';

const { Header, Content } = Layout;

const CodeEditor = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    // 根据模板设置编程语言
    if (location.state?.template) {
      switch (location.state.template) {
        case 'python':
          setLanguage('python');
          break;
        case 'java':
          setLanguage('java');
          break;
        case 'c':
          setLanguage('c');
          break;
        default:
          setLanguage('javascript');
      }
    }
    
    // TODO: 从后端加载项目代码
    loadProjectCode();
  }, [projectId]);

  const loadProjectCode = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/code`);
      const data = await response.json();
      setCode(data.code);
    } catch (error) {
      message.error('加载代码失败');
    }
  };

  return (
    <Layout className="editor-layout">
      <Header className="editor-header">
        <h2>{location.state?.projectName || '未命名项目'}</h2>
      </Header>
      <Content className="editor-content">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
          }}
        />
      </Content>
    </Layout>
  );
};

export default CodeEditor; 