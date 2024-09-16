import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useCategory } from '../../context/CategoryContext';

const CategoryList = () => {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      await fetchCategories();
      setLoading(false);
    };

    loadCategories();
  }, [fetchCategories]);

  const showModal = (category = null) => {
    setEditingCategory(category);
    form.setFieldsValue(category || { en_category_name: '', ar_category_name: '' });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success('Category updated successfully');
      } else {
        await addCategory(values);
        message.success('Category added successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success('Category deleted successfully');
        } catch (error) {
          message.error('An error occurred. Please try again.');
        }
      },
    });
  };

  const columns = [
    {
      title: 'English Name',
      dataIndex: 'en_category_name',
      key: 'en_category_name',
    },
    {
      title: 'Arabic Name',
      dataIndex: 'ar_category_name',
      key: 'ar_category_name',
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
        <h2 className="text-2xl font-semibold">Category Management</h2>
        <Button 
          type="primary" 
          onClick={() => showModal()} 
          icon={<PlusOutlined />}
        >
          Add Category
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="en_category_name"
            label="English Category Name"
            rules={[{ required: true, message: 'Please input the English category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ar_category_name"
            label="Arabic Category Name"
            rules={[{ required: true, message: 'Please input the Arabic category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
