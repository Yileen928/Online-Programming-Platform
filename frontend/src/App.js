import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
// import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Projects from './components/Projects';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      getPopupContainer={node => {
        if (node) {
          return node.parentNode;
        }
        return document.body;
      }}
    >
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/datasets" element={<DatasetManagement />} />
          <Route path="/teams" element={<div>团队管理页面</div>} />
          <Route path="/discussions" element={<div>讨论页面</div>} />
          <Route path="/settings" element={<div>设置页面</div>} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
