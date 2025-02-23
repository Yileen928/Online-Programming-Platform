import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Tabs, Upload, Avatar } from 'antd';
import { UserOutlined, UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { userApi } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './style.css';
import axios from 'axios';
import { useMessage } from '../../hooks/useMessage';

const { TabPane } = Tabs;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const LogoutButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

const SettingsContainer = styled.div`
  .settings-content {
    display: flex;
    flex-direction: column;
  }
`;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const messageApi = useMessage();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getUserInfo();
      if (response.success) {
        const userData = response.data;
        setUserInfo(userData);
        localStorage.setItem('userId', userData.id);
        form.setFieldsValue({
          email: userData.email,
          username: userData.username
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      messageApi.error('获取用户信息失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      if (!values.email) {
        messageApi.error('邮箱不能为空');
        return;
      }

      setLoading(true);
      const response = await userApi.updateProfile(values);
      if (response.success) {
        messageApi.success('个人信息更新成功');
        await fetchUserInfo(); // 重新获取用户信息
      } else {
        throw new Error(response.message || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      messageApi.error(error.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const response = await userApi.changePassword(values);
      if (response.data?.success) {
        messageApi.success('密码修改成功');
        passwordForm.resetFields();
        
        // 显示弹窗，点击确定后跳转
        window.alert('密码已修改，为了安全起见，请重新登录');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('密码修改失败:', error);
      messageApi.error(error.response?.data?.message || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        messageApi.error('只能上传图片文件！');
        return false;
      }
      if (!isLt2M) {
        messageApi.error('图片必须小于2MB!');
        return false;
      }

      const formData = new FormData();
      formData.append('file', file);
      
      // 使用 userApi 的方法
      const response = await userApi.updateAvatar(formData);
      
      if (response.success) {
        messageApi.success('头像更新成功');
        await fetchUserInfo(); // 重新获取用户信息
      } else {
        throw new Error(response.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      messageApi.error('上传失败: ' + (error.response?.data?.message || error.message));
    }
  };

  // 添加退出登录处理函数
  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token'); // 清除本地token
      messageApi.success('退出登录成功');
      navigate('/login');
    } catch (error) {
      // 即使后端请求失败，也清除本地token并跳转
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // 修改 Tabs 的使用方式，使用 items 属性
  const items = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <>
          <AvatarSection>
            <Avatar 
              size={120} 
              icon={<UserOutlined />}
              src={userInfo?.avatarUrl ? `${userInfo.avatarUrl}` : undefined}
              onError={(e) => {
                console.log('Avatar load error:', e);
                if (e?.target) {
                  e.target.onerror = null;
                  e.target.src = '';
                }
                return true;
              }}
              style={{ backgroundColor: '#f0f0f0' }}
            />
            
            <Upload
              name="file"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isImage) {
                  messageApi.error('只能上传图片文件！');
                  return false;
                }
                if (!isLt2M) {
                  messageApi.error('图片必须小于2MB！');
                  return false;
                }

                handleAvatarUpload(file);
                return false;
              }}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={loading}
                disabled={loading}
              >
                {loading ? '上传中...' : '更换头像'}
              </Button>
            </Upload>
            
            <small style={{ color: '#666' }}>
              支持 jpg、png 格式，文件小于2MB
            </small>
          </AvatarSection>

          <Form
            form={form}
            onFinish={handleUpdateProfile}
            initialValues={userInfo}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
                { whitespace: true, message: '邮箱不能为空' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                更新信息
              </Button>
            </Form.Item>
          </Form>
        </>
      )
    },
    {
      key: '2',
      label: '修改密码',
      children: (
        <Form
          form={passwordForm}
          onFinish={handleChangePassword}
          layout="vertical"
        >
          <div className="password-rules">
            <p>密码必须满足以下要求：</p>
            <ul>
              <li>长度在8-16位之间</li>
              <li>必须包含至少一个字母</li>
              <li>必须包含至少一个数字</li>
              <li>必须包含至少一个特殊字符（@$!%*#?&）</li>
            </ul>
          </div>
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度不能小于8位' },
              { max: 16, message: '密码长度不能超过16位' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/,
                message: '密码必须包含字母、数字和特殊字符，长度在8-16位之间'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <SettingsContainer>
      <div className="settings-content">
        <Tabs items={items} defaultActiveKey="1" />
        <LogoutButton 
          type="primary" 
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          退出登录
        </LogoutButton>
      </div>
    </SettingsContainer>
  );
};

export default Settings; 