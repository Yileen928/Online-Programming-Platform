import React, { useState } from 'react';
import { userApi } from '../api/user';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      message.error('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const result = await userApi.login(formData);
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', formData.username);
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

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>用户登录</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-item">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="请输入用户名"
          />
        </div>

        <div className="form-item">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请输入密码"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
};

export default Login;
