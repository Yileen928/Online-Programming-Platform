import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post('/api/auth/register', values);
      message.success('注册成功！');
      navigate('/login');
    } catch (error) {
      message.error('注册失败：' + error.message);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input placeholder="用户名" />
      </Form.Item>
      
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="邮箱" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="密码" />
      </Form.Item>

      <Form.Item name="confirmPassword" rules={[
        { required: true },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject('两次输入的密码不一致！');
          },
        }),
      ]}>
        <Input.Password placeholder="确认密码" />
      </Form.Item>

      <Button type="primary" htmlType="submit">注册</Button>
    </Form>
  );
};

export default Register;