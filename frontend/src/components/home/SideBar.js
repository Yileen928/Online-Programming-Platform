import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { FolderOutlined, TeamOutlined, DatabaseOutlined, CommentOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const SIDE_MENU_ITEMS = [
  { key: 'home', icon: <FolderOutlined />, label: 'Home', path: '/home' },
  { key: 'project', icon: <FolderOutlined />, label: '项目管理', path: '/projects' },
  { key: 'team', icon: <TeamOutlined />, label: '团队管理', path: '/teams' },
  { key: 'dataset', icon: <DatabaseOutlined />, label: '数据集', path: '/datasets' },
  { key: 'discussion', icon: <CommentOutlined />, label: '讨论', path: '/discussions' },
  { key: 'settings', icon: <SettingOutlined />, label: '设置', path: '/settings' }
];

const SideBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleMenuClick = (item) => {
    const menuItem = SIDE_MENU_ITEMS.find(i => i.key === item.key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <Sider theme="light" className="home-sider">
      <div className="logo">Logo</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        items={SIDE_MENU_ITEMS}
        onClick={handleMenuClick}
      />
      <div className="logout-button">
        <Button icon={<LogoutOutlined />} block onClick={onLogout}>
          登出
        </Button>
      </div>
    </Sider>
  );
};

export default SideBar; 