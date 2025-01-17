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

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < codeExample.length) {
        setTypingText(prev => {
          const newText = prev + codeExample[currentIndex];
          setTimeout(() => {
            Prism.highlightAll();
          }, 0);
          return newText;
        });
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post('/api/auth/login', values);
      
      if (response.data.success) {
        message.success('登录成功！');
        localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1000);
      } else {
        message.error(response.data.message || '用户名或密码错误！');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('登录失败：' + (error.response?.data?.message || '用户名或密码错误'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-section">
        <div className="login-form-container">
          <div className="logo" alt="logo" > </div>
          <div className='login-input'>
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                className="login-button"
                size="large"
              >
                登录
              </Button>
            </Form.Item>

            <div className="login-links">
              <Link to="/forgot-password">忘记密码？</Link>
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
