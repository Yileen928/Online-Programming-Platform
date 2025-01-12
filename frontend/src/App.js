import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import ProjectManagement from './components/ProjectManagement';
import DatasetManagement from './components/DatasetManagement';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('token', 'fake-token-for-development');
    }
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/datasets" element={<DatasetManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
