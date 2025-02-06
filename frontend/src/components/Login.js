import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import './Login.css';
import { userApi } from '../api/user';
import { useMessage } from '../hooks/useMessage';
import axios from 'axios';

// 设置基础URL
axios.defaults.baseURL = 'http://localhost:8080';

const Login = () => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const codeExample = `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[0];
  const left = [];
  const right = [];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const array = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(array));`;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await userApi.login(values);
      
      if (response?.token) {
        localStorage.setItem('token', response.token);
        messageApi.success('登录成功');
        
        // 检查是否有重定向路径
        const redirectPath = localStorage.getItem('redirectPath');
        if (redirectPath) {
          localStorage.removeItem('redirectPath');
          navigate(redirectPath);
        } else {
          navigate('/home');
        }
      } else {
        throw new Error('登录失败：服务器返回数据格式错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      messageApi.error(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <div className="login-section">
        <div className="login-form-container">
          <div className="logo" alt="logo" > </div>
          <div className='login-input'>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
                size="large"
                autoComplete="username"
              />
            </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  size="large"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>

              <div className="login-links">
                <Link to="/forgot-password">忘记密码？</Link>
                <Link to="/register">注册账号</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
      
      <div className="code-section">
        <div className="test-font"></div>
        <pre className="code-display">
          <code className="language-javascript">
            {typingText}
          </code>
          <span className="typing-text"> </span>
        </pre>
      </div>
    </div>
  );
};

export default Login;
