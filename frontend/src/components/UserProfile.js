import React, { useState, useEffect } from 'react';
import { Avatar, Button, Input, message, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/users/info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async () => {
    try {
      await axios.post('/api/users/profile', {
        userId: user.id,
        username: user.username,
        email: user.email
      });
      message.success('更新成功');
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/users/avatar', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setUser({
          ...user,
          avatarFileId: response.data.data.avatarFileId
        });
        message.success('头像更新成功');
      }
    } catch (error) {
      message.error('头像上传失败');
      console.error('上传错误:', error);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <Upload
          name="file"
          showUploadList={false}
          customRequest={({ file }) => {
            handleAvatarUpload(file);
          }}
        >
          <Avatar 
            size={100} 
            icon={<UserOutlined />}
            src={user?.avatarFileId ? `/api/users/avatar/${user.avatarFileId}` : null}
          />
          <div className="upload-avatar">
            <Button>更换头像</Button>
          </div>
        </Upload>
      </div>

      <div className="profile-form">
        <div className="form-item">
          <label>用户名</label>
          <Input 
            value={user?.username} 
            disabled 
            placeholder="用户名"
          />
        </div>
        <div className="form-item">
          <label>邮箱</label>
          <Input 
            value={user?.email} 
            onChange={e => setUser({...user, email: e.target.value})}
            placeholder="邮箱"
          />
        </div>
        <Button type="primary" onClick={handleUpdateInfo}>
          保存修改
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
