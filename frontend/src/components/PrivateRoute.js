import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { userApi } from '../api/user';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi] = message.useMessage();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('未登录');
        }
        
        const response = await userApi.checkAuth();
        if (response?.valid) {
          setIsAuthenticated(true);
        } else {
          throw new Error('认证失败');
        }
      } catch (error) {
        console.error('认证失败:', error);
        localStorage.removeItem('token');
        messageApi.error('请先登录');
        navigate('/login', { 
          state: { from: location },
          replace: true 
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location, messageApi]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return isAuthenticated ? children : null;
};

export default PrivateRoute; 