import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useBrand } from '../../context/BrandContext';
import { useCategory } from '../../context/CategoryContext';
import translate from 'translate';

const { Option } = Select;

const BrandList = () => {
  const { brands, addBrand, updateBrand, deleteBrand, fetchBrands, isLoading } = useBrand();
  const { categories } = useCategory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isLoading) {
      fetchBrands();
    }
  }, [fetchBrands, isLoading]);

  const showModal = (brand = null) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand || { en_brand_name: '', ar_brand_name: '', category_id: undefined });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBrand(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, values);
        message.success('Brand updated successfully');
      } else {
        await addBrand(values);
        message.success('Brand added successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this brand?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteBrand(id);
          message.success('Brand deleted successfully');
        } catch (error) {
          message.error('An error occurred. Please try again.');
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

  const handleEnglishInputChange = async (e) => {
    const englishText = e.target.value;
    if (englishText) {
      const arabicText = await translateText(englishText, 'ar');
      form.setFieldsValue({ ar_brand_name: arabicText });
    }
  };

  const columns = [
    {
      title: 'English Name',
      dataIndex: 'en_brand_name',
      key: 'en_brand_name',
    },
    {
      title: 'Arabic Name',
      dataIndex: 'ar_brand_name',
      key: 'ar_brand_name',
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (category_id) => categories.find(cat => cat.id === category_id)?.en_category_name || 'Unknown',
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
        loading={isLoading}
      />

      <Modal
        title={editingBrand ? "Edit Brand" : "Add Brand"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="en_brand_name"
            label="English Brand Name"
            rules={[{ required: true, message: 'Please input the English brand name!' }]}
          >
            <Input onChange={handleEnglishInputChange} />
          </Form.Item>
          <Form.Item
            name="ar_brand_name"
            label="Arabic Brand Name"
            rules={[{ required: true, message: 'Please input the Arabic brand name!' }]}
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
                <Option key={category.id} value={category.id}>{category.en_category_name}</Option>
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
