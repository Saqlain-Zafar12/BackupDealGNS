import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch brands and categories from your API
    // This is a mock implementation
    setBrands([
      { id: 1, name: 'Nike', category_id: 1 },
      { id: 2, name: 'Adidas', category_id: 1 },
      { id: 3, name: 'Apple', category_id: 2 },
    ]);
    setCategories([
      { id: 1, name: 'Clothing' },
      { id: 2, name: 'Electronics' },
    ]);
  }, []);

  const showModal = (brand = null) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand || { name: '', category_id: undefined });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBrand(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const newBrand = {
      id: editingBrand ? editingBrand.id : Date.now(),
      name: values.name,
      category_id: values.category_id,
    };

    if (editingBrand) {
      setBrands(brands.map(brand => brand.id === editingBrand.id ? newBrand : brand));
      message.success('Brand updated successfully');
    } else {
      setBrands([...brands, newBrand]);
      message.success('Brand added successfully');
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setBrands(brands.filter(brand => brand.id !== id));
        message.success('Brand deleted successfully');
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
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (category_id) => categories.find(cat => cat.id === category_id)?.name || 'Unknown',
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
        <h2 className="text-2xl font-semibold">Brand Management</h2>
        <Button 
          type="primary" 
          onClick={() => showModal()} 
          icon={<PlusOutlined />}
        >
          Add Brand
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={brands} 
        rowKey="id"
      />

      <Modal
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: 'Please input the brand name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select a category">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBrand ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandList;
