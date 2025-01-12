import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  ProjectOutlined,
  TeamOutlined,
  DatabaseOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const SideBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/home')
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
      onClick: () => navigate('/projects')
    },
    {
      key: 'teams',
      icon: <TeamOutlined />,
      label: '团队管理',
      onClick: () => navigate('/teams')
    },
    {
      key: 'datasets',
      icon: <DatabaseOutlined />,
      label: '数据集',
      onClick: () => navigate('/datasets')
    },
    {
      key: 'discussions',
      icon: <MessageOutlined />,
      label: '讨论',
      onClick: () => navigate('/discussions')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <Sider className="home-sider" theme="dark" width={200}>
      <div className="logo">Logo</div>
      <Menu
        mode="inline"
        theme="dark"
        defaultSelectedKeys={['home']}
        items={menuItems}
      />
      <div className="logout-button">
        <Menu theme="dark" mode="inline">
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
};

export default SideBar; 