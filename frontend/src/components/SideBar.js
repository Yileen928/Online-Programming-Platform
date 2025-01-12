import { Menu } from 'antd';

const SideBar = () => {
  const menuItems = [
    {
      key: '1',
      label: '首页',
      icon: <HomeOutlined />,
    },
    {
      key: '2',
      label: '项目',
      icon: <ProjectOutlined />,
    },
    // ... 其他菜单项
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>在线编程平台</h1>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={menuItems}
      />
    </aside>
  );
};

export default SideBar; 