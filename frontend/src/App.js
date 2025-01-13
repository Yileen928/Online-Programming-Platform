import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ConfigProvider, theme, Layout } from 'antd';
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';
import TeamManagement from './components/TeamManagement';
import SideBar from './components/SideBar';
import { useEffect } from 'react';
import './styles/prism-theme.css';

const { Content } = Layout;

// 定义全局深色主题
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgContainer: '#1a1a1a',
    colorBgElevated: '#2a2a2a',
    colorText: '#fff',
    colorBgLayout: '#1a1a1a',
    colorBorder: '#333',
    borderRadius: 8,
  },
  components: {
    Menu: {
      colorItemBg: '#1a1a1a',
      colorItemText: '#fff',
      colorItemTextSelected: '#fff',
      colorItemBgSelected: '#2a2a2a',
    },
    Layout: {
      colorBgHeader: '#1a1a1a',
      colorBgBody: '#1a1a1a',
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

function App() {
  return (
    <ConfigProvider theme={darkTheme}>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* 需要登录的路由 */}
          <Route path="/home" element={
            <MainLayout>
              <Home />
            </MainLayout>
          } />
          <Route path="/projects" element={
            <MainLayout>
              <ProjectManagement />
            </MainLayout>
          } />
          <Route path="/datasets" element={
            <MainLayout>
              <DatasetManagement />
            </MainLayout>
          } />
          <Route path="/teams" element={
            <MainLayout>
              <TeamManagement />
            </MainLayout>
          } />
          <Route path="/discussions" element={
            <MainLayout>
              <div>讨论页面</div>
            </MainLayout>
          } />
          <Route path="/settings" element={
            <MainLayout>
              <div>设置页面</div>
            </MainLayout>
          } />
          
          {/* 404 页面 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
