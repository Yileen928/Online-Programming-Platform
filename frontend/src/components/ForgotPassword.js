import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ForgotPassword = () => {
  const onFinish = async (values) => {
    try {
      await axios.post('/api/auth/forgot-password', values);
      message.success('重置密码链接已发送到您的邮箱！');
    } catch (error) {
      message.error('发送失败：' + error.message);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="请输入注册邮箱" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        发送重置链接
      </Button>
    </Form>
  );
};

export default ForgotPassword;