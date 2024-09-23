import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAttribute } from '../../context/AttributesContext';
import translate from 'translate';

const AttributeManagement = () => {
  const { attributes, addAttribute, updateAttribute, deleteAttribute, isLoading } = useAttribute();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [form] = Form.useForm();

  const showModal = (attribute = null) => {
    setEditingAttribute(attribute);
    form.setFieldsValue(attribute || { en_attribute_name: '', ar_attribute_name: '' });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAttribute(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingAttribute) {
        await updateAttribute(editingAttribute.id, values);
        message.success('Attribute updated successfully');
      } else {
        await addAttribute(values);
        message.success('Attribute added successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('Failed to save attribute');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this attribute?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteAttribute(id);
          message.success('Attribute deleted successfully');
        } catch (error) {
          message.error('Failed to delete attribute');
        }
      },
    });
  };

  const translateText = async (text, targetLang) => {
    try {
      const translatedText = await translate(text, { to: targetLang });
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return '';
    }
  };

  const handleEnglishInputChange = async () => {
    const englishValue = form.getFieldValue('en_attribute_name');
    if (englishValue) {
      const arabicValue = await translateText(englishValue, 'ar');
      form.setFieldsValue({ ar_attribute_name: arabicValue });
    }
  };

  const columns = [
    {
      title: 'English Name',
      dataIndex: 'en_attribute_name',
      key: 'en_attribute_name',
      width: 150,
    },
    {
      title: 'Arabic Name',
      dataIndex: 'ar_attribute_name',
      key: 'ar_attribute_name',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
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

      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={attributes} 
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>

      <Modal
        title={editingAttribute ? "Edit Attribute" : "Add Attribute"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="en_attribute_name"
            label="English Attribute Name"
            rules={[{ required: true, message: 'Please input the English attribute name!' }]}
          >
            <Input onChange={handleEnglishInputChange} />
          </Form.Item>
          <Form.Item
            name="ar_attribute_name"
            label="Arabic Attribute Name"
            rules={[{ required: true, message: 'Please input the Arabic attribute name!' }]}
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