import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const AttributeManagement = () => {
  const [attributes, setAttributes] = useState([
    { id: 1, name: 'Color' },
    { id: 2, name: 'Size' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [form] = Form.useForm();

  const showModal = (attribute = null) => {
    setEditingAttribute(attribute);
    form.setFieldsValue(attribute || { name: '' });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAttribute(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const newAttribute = {
      id: editingAttribute ? editingAttribute.id : Date.now(),
      name: values.name,
    };

    if (editingAttribute) {
      setAttributes(attributes.map(attr => attr.id === editingAttribute.id ? newAttribute : attr));
    } else {
      setAttributes([...attributes, newAttribute]);
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this attribute?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setAttributes(attributes.filter(attr => attr.id !== id));
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showModal(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Attribute Management</h2>
        <Button 
          type="primary" 
          onClick={() => showModal()} 
          icon={<PlusOutlined />}
        >
          Add Attribute
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={attributes} 
        rowKey="id"
      />

      <Modal
        title={editingAttribute ? "Edit Attribute" : "Add Attribute"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Attribute Name"
            rules={[{ required: true, message: 'Please input the attribute name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAttribute ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttributeManagement;