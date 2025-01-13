import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Login from './components/Login';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';
import TeamManagement from './components/TeamManagement';

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

function App() {
  return (
    <ConfigProvider theme={darkTheme}>
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/datasets" element={<DatasetManagement />} />
          <Route path="/teams" element={<TeamManagement />} />
          <Route path="/discussions" element={<div>讨论页面</div>} />
          <Route path="/settings" element={<div>设置页面</div>} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
