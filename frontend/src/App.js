import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate, createRoutesFromElements, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme, Layout, message } from 'antd';
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';
import TeamManagement from './components/TeamManagement';
import SideBar from './components/SideBar';
import { useEffect, useState } from 'react';
import './styles/prism-theme.css';
import './styles/github.css';
import { MessageContext } from './contexts/MessageContext';
import { userApi } from './api/user';
import ProjectEditor from './pages/ProjectEditor';
import Settings from './pages/Settings';

const { Content } = Layout;

// 定义全局深色主题
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgContainer: '#1a1a1a',
    colorBgElevated: '#2a2a2a',
    colorText: '#fff',
    bodyBg: '#1a1a1a',
    borderRadius: 8,
  },
  components: {
    Menu: {
      itemBg: '#1a1a1a',
      itemColor: '#fff',
      itemSelectedColor: '#fff',
      itemSelectedBg: '#2a2a2a',
    },
    Layout: {
      headerBg: '#1a1a1a',
      bodyBg: '#1a1a1a',
    },
    Input: {
      colorBgContainer: '#2a2a2a',
      colorBorder: '#333',
    },
    Button: {
      colorPrimary: '#8b0000',
      colorPrimaryHover: '#a00000',
    }
  }
};

// 创建一个布局组件来包装需要导航栏的页面
const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ padding: '24px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

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

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* 根路由重定向到登录页面 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* 受保护的路由 */}
        <Route path="/home" element={
          <PrivateRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/projects" element={
          <PrivateRoute>
            <MainLayout>
              <ProjectManagement />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/datasets" element={
          <PrivateRoute>
            <MainLayout>
              <DatasetManagement />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/teams" element={
          <PrivateRoute>
            <MainLayout>
              <TeamManagement />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/discussions" element={
          <PrivateRoute>
            <MainLayout>
              <div>讨论页面</div>
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </PrivateRoute>
        } />
        <Route path="/projects/:projectId/editor" element={
          <PrivateRoute>
            <MainLayout>
              <ProjectEditor />
            </MainLayout>
          </PrivateRoute>
        } />

        {/* 404 路由 - 必须放在最后 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </>
    ),
    {
      basename: '/', // 添加基础路径
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }
  );

  return (
    <ConfigProvider theme={darkTheme}>
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        <RouterProvider router={router} />
      </MessageContext.Provider>
    </ConfigProvider>
  );
}

export default App;
