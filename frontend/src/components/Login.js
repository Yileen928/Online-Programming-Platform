import React, { useState } from 'react';
import { userApi } from '../api/user';
import { message, Form, Input, Button } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 表单布局配置（可选）
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  // 表单提交处理
  const onFinish = async (values) => {
    const { username, password } = values;

    if (!username || !password) {
      message.error('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await userApi.login({ username, password });
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', username);
        message.success('登录成功');
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 表单提交失败处理（可选）
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Form
        {...layout}
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h2>用户登录</h2>

        {/* 错误信息展示 */}
        {error && <div className="error-message">{error}</div>}

        {/* 用户名输入框 */}
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        {/* 密码输入框 */}
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>

        {/* 注册和忘记密码链接 */}
        <Form.Item {...tailLayout}>
          <div className="login-links">
            {/* <Link to="/register">注册新账号</Link> */}
            <Link to="/forgot-password">忘记密码？</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
