import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  ProjectOutlined,
  TeamOutlined,
  DatabaseOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './SideBar.css';

const { Sider } = Layout;

const SideBar = React.memo(({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = useMemo(() => [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: 'Home'
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目管理'
    },
    {
      key: '/teams',
      icon: <TeamOutlined />,
      label: '团队管理'
    },
    {
      key: '/datasets',
      icon: <DatabaseOutlined />,
      label: '数据集'
    },
    {
      key: '/discussions',
      icon: <MessageOutlined />,
      label: '讨论'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置'
    }
  ], []);

  const handleMenuClick = ({ key }) => {
    if (key !== location.pathname) {
      navigate(key);
    }
  };

  return (
    <Sider className="home-sider">
      <div className="logo">Logo</div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
      <div className="logout-button">
        <Menu mode="inline">
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={onLogout}
          >
            退出登录
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
});

SideBar.displayName = 'SideBar';

export default SideBar; 