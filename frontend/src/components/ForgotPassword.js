import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import styled from 'styled-components';
import { MessageContext } from '../contexts/MessageContext';

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

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const messageApi = useContext(MessageContext);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', values);
      messageApi.success('重置密码链接已发送到您的邮箱！请查收');
      form.resetFields();
    } catch (error) {
      messageApi.error(error.response?.data?.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        找回密码
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        请输入您注册时使用的邮箱，我们将向该邮箱发送重置密码的链接。
      </Text>
      
      <StyledForm
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />}
            placeholder="请输入注册邮箱"
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
            发送重置链接
          </Button>
        </Form.Item>
      </StyledForm>
    </StyledCard>
  );
};

export default ForgotPassword;