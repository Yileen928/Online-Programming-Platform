import React, { useState } from 'react';
import { Layout, Table, Button, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './TeamManagement.css';

const { Header, Content } = Layout;

const TeamManagement = () => {
  const [teams] = useState([
    {
      key: '1',
      name: '开发团队A',
      members: ['张三', '李四', '王五'],
      projects: 3,
      created: '2024-01-01'
    },
    {
      key: '2',
      name: '测试团队B',
      members: ['赵六', '钱七'],
      projects: 2,
      created: '2024-01-02'
    }
  ]);

  const columns = [
    {
      title: '团队名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '成员',
      dataIndex: 'members',
      key: 'members',
      render: (members) => (
        <Avatar.Group maxCount={3}>
          {members.map((member, index) => (
            <Avatar key={index} icon={<UserOutlined />} />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: '项目数量',
      dataIndex: 'projects',
      key: 'projects',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">管理成员</Button>
          <Button type="link">查看项目</Button>
          <Button type="link" danger>解散团队</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="team-content">
      <div className="team-header">
        <h2>团队管理</h2>
        <Button type="primary">创建团队</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={teams}
        pagination={false}
      />
    </div>
  );
};

export default TeamManagement; 