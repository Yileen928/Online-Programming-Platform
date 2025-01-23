import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';

const GiteeConnect = ({ onConnectSuccess }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await axios.post('/api/gitee/connect', { token });
      message.success('Gitee 连接成功！');
      if (onConnectSuccess) {
        onConnectSuccess();
      }
    } catch (error) {
      message.error('连接失败：' + error.response?.data?.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="连接 Gitee" extra={<GithubOutlined />}>
      <Input.Password
        placeholder="请输入 Gitee Token"
        value={token}
        onChange={e => setToken(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" onClick={handleConnect} loading={loading} block>
        连接
      </Button>
    </Card>
  );
};

export default GiteeConnect; 