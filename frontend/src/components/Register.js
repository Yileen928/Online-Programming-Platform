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

const MenuItem = ({ item, selected, onClick }) => {
  return (
    <div 
      className={`menu-item ${selected ? 'menu-item-selected' : ''}`} 
      onClick={onClick}
    >
      {item.icon}
      <span>{item.label}</span>
      <div className="top-border" />
      <div className="bottom-border" />
      <div className="triangle" />
    </div>
  );
};

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

  const handleMenuClick = (key) => {
    navigate(key);
  };

  const currentPath = '/' + location.pathname.split('/')[1];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>在线编程平台</h1>
      </div>
      <div className="menu-container">
        {menuItems.map(item => (
          <MenuItem
            key={item.key}
            item={item}
            selected={currentPath === item.key}
            onClick={() => handleMenuClick(item.key)}
            theme="light"  // 添加这行
      style={{ background: 'transparent' }} 
          />
        ))}
      </div>
    </aside>
  );
};

export default SideBar;