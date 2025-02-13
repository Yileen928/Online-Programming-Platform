import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Tabs, Modal } from 'antd';
import { userApi } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import './style.css';

const { TabPane } = Tabs;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getUserInfo();
      if (response.data?.success) {
        form.setFieldsValue({
          email: response.data.data.email,
          username: response.data.data.username
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败');
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      const response = await userApi.updateProfile(values);
      if (response.data?.success) {
        message.success('个人信息更新成功');
        fetchUserInfo();
      }
    } catch (error) {
      console.error('更新失败:', error);
      message.error(error.response?.data?.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const response = await userApi.changePassword(values);
      if (response.data?.success) {
        message.success('密码修改成功');
        passwordForm.resetFields();
        
        // 显示弹窗，点击确定后跳转
        window.alert('密码已修改，为了安全起见，请重新登录');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('密码修改失败:', error);
      message.error(error.response?.data?.message || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <Card title="个人设置" bordered={false}>
        <Tabs defaultActiveKey="profile">
          <TabPane tab="个人信息" key="profile">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
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
                  { type: 'email', message: '请输入有效的邮箱地址' }
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
          </TabPane>
          
          <TabPane tab="修改密码" key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
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
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings; 