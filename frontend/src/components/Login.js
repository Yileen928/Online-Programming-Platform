import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const codeExample = `// 快速排序算法实现
function quickSort(arr) {
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

// 测试数组
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(array));
// 输出: [11, 12, 22, 25, 34, 64, 90]`;

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < codeExample.length) {
        setTypingText(prev => {
          const newText = prev + codeExample[currentIndex];
          // 每次更新文本后重新应用高亮
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

  const onFinish = (values) => {
    console.log('登录信息:', values);
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-section">
        <div className="login-form-container">
          <h1 className="login-title">在线编程平台</h1>
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
              <Link to="/register">注册账号</Link>
              <Link to="/forgot-password">忘记密码？</Link>
            </div>
          </Form>
        </div>
      </div>
      
      <div className="code-section">
        <div className="test-font">测试字体加载</div>
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
