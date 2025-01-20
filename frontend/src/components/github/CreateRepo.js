import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const CreateRepo = () => {
  const [form] = Form.useForm();

  const handleCreate = async (values) => {
    try {
      await axios.post('/api/github/repos', values);
      message.success('仓库创建成功！');
      form.resetFields();
    } catch (error) {
      message.error('创建失败：' + error.response?.data?.message || '未知错误');
    }
  };

  return (
    <Card title="创建仓库" extra={<PlusOutlined />}>
      <Form form={form} onFinish={handleCreate}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入仓库名称' }]}
        >
          <Input placeholder="仓库名称" />
        </Form.Item>
        <Form.Item name="description">
          <Input.TextArea placeholder="仓库描述" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            创建
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateRepo; 