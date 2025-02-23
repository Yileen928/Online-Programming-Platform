import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  max-width: 400px;
  margin: 50px auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const StyledForm = styled(Form)`
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从 URL 中获取重置令牌
  const token = new URLSearchParams(location.search).get('token');

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword: values.newPassword
      });
      
      message.success('密码重置成功！');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || '密码重置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <StyledCard>
        <Text type="danger">无效的重置链接</Text>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        重置密码
      </Title>
      
      <StyledForm
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '密码长度不能小于8位' },
            { 
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              message: '密码必须包含字母、数字和特殊字符'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
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
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请确认新密码"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
          >
            确认重置
          </Button>
        </Form.Item>
      </StyledForm>
    </StyledCard>
  );
};

export default ResetPassword; 