import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';

const CreateRepo = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const requestData = {
        name: values.name,
        description: values.description,
        private: values.visibility === 'private'  // 确保这里的值是布尔类型
      };
      
      console.log('Creating repository:', requestData);  // 添加日志
      
      const response = await axios.post('/api/github/repos', requestData);
      console.log('Repository created:', response.data);  // 添加日志
      
      message.success('仓库创建成功！');
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Create repository error:', error.response?.data);  // 添加错误日志
      message.error('创建失败：' + error.response?.data?.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建GitHub仓库" extra={<PlusOutlined />}>
      <Form 
        form={form} 
        onFinish={handleCreate} 
        initialValues={{ visibility: 'public' }}  // 默认为公开仓库
      >
        <Form.Item
          name="name"
          rules={[
            { required: true, message: '请输入仓库名称' },
            { pattern: /^[a-zA-Z0-9_.-]+$/, message: '仓库名称只能包含字母、数字、下划线、点和横线' }
          ]}
        >
          <Input placeholder="仓库名称" />
        </Form.Item>
        
        <Form.Item name="description">
          <Input.TextArea placeholder="仓库描述（可选）" />
        </Form.Item>
        
        <Form.Item 
          name="visibility" 
          label="仓库类型"
        >
          <Radio.Group>
            <Radio value="public">公开仓库</Radio>
            <Radio value="private">私有仓库</Radio>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            创建
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateRepo; 