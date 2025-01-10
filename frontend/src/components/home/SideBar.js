import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { FolderOutlined, TeamOutlined, DatabaseOutlined, CommentOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const SIDE_MENU_ITEMS = [
  { key: 'home', icon: <FolderOutlined />, label: 'Home' },
  { key: 'project', icon: <FolderOutlined />, label: '项目管理' },
  { key: 'team', icon: <TeamOutlined />, label: '团队管理' },
  { key: 'dataset', icon: <DatabaseOutlined />, label: '数据集' },
  { key: 'discussion', icon: <CommentOutlined />, label: '讨论' },
  { key: 'settings', icon: <SettingOutlined />, label: '设置' }
];

const SideBar = ({ onLogout }) => (
  <Sider theme="light" className="home-sider">
    <div className="logo">Logo</div>
    <Menu
      mode="inline"
      defaultSelectedKeys={['home']}
      items={SIDE_MENU_ITEMS}
    />
    <div className="logout-button">
      <Button icon={<LogoutOutlined />} block onClick={onLogout}>
        登出
      </Button>
    </div>
  </Sider>
);

export default SideBar; 