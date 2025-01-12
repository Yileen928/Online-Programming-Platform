import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';

function App() {
  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/datasets" element={<DatasetManagement />} />
        <Route path="/teams" element={<div>团队管理页面</div>} />
        <Route path="/discussions" element={<div>讨论页面</div>} />
        <Route path="/settings" element={<div>设置页面</div>} />
      </Routes>
    </Router>
  );
}

export default App;
