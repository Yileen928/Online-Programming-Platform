import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ConfigProvider, theme, Layout, message } from 'antd';
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';
import TeamManagement from './components/TeamManagement';
import SideBar from './components/SideBar';
import { useEffect } from 'react';
import './styles/prism-theme.css';
import { MessageContext } from './contexts/MessageContext';

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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location, navigate]);

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
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // 将用户重定向到登录页面，但保存他们试图访问的URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <ConfigProvider theme={darkTheme}>
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        <Router>
          <Routes>
            {/* 公开路由 */}
            <Route path="/" element={<Login />} />
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
                  <div>设置页面</div>
                </MainLayout>
              </PrivateRoute>
            } />
            
            {/* 404 页面 */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </MessageContext.Provider>
    </ConfigProvider>
  );
}

export default App;
