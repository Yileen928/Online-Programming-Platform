import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';

const CreateGiteeRepo = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        private: !!values.private
      };
      await axios.post('/api/gitee/repos', data);
      message.success('仓库创建成功！');
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error('创建失败：' + error.response?.data?.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="创建Gitee仓库" extra={<PlusOutlined />}>
      <Form form={form} onFinish={handleCreate} initialValues={{ private: false }}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入仓库名称' }]}
        >
          <Input placeholder="仓库名称" />
        </Form.Item>
        <Form.Item name="description">
          <Input.TextArea placeholder="仓库描述" />
        </Form.Item>
        <Form.Item name="private" valuePropName="checked">
          <Switch 
            checkedChildren="私有" 
            unCheckedChildren="公开"
          />
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

export default CreateGiteeRepo; 