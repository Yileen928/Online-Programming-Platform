import { Menu } from 'antd';
import { 
  HomeOutlined, 
  ProjectOutlined, 
  DatabaseOutlined,
  TeamOutlined,
  MessageOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: '首页',
      order: 1
    },
    
  
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目',
      order: 2
    },
    {
      key: '/datasets',
      icon: <DatabaseOutlined />,
      label: '数据集',
      order: 3
    },
    {
      key: '/teams',
      icon: <TeamOutlined />,
      label: '团队',
      order: 4
    },
    {
      key: '/discussions',
      icon: <MessageOutlined />,
      label: '讨论',
      order: 5
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
      order: 6
    }
  ].sort((a, b) => a.order - b.order);

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const currentPath = '/' + location.pathname.split('/')[1];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>在线编程平台</h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        items={menuItems}
        onClick={handleMenuClick}
        className="sidebar-menu"
        theme="light"  // 添加这行
      style={{ background: 'transparent' }}
      />
    </aside>
  );
};

export default SideBar; 