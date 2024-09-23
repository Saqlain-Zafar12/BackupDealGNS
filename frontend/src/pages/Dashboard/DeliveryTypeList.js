import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDeliveryType } from '../../context/deliveryTypeContext';

const DeliveryTypeList = () => {
  const { deliveryTypes, addDeliveryType, updateDeliveryType, deleteDeliveryType, fetchDeliveryTypes } = useDeliveryType();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDeliveryType, setEditingDeliveryType] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeliveryTypes = async () => {
      setLoading(true);
      await fetchDeliveryTypes();
      setLoading(false);
    };

    loadDeliveryTypes();
  }, [fetchDeliveryTypes]);

  const showModal = (deliveryType = null) => {
    setEditingDeliveryType(deliveryType);
    form.setFieldsValue(deliveryType || { name: '' });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingDeliveryType(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingDeliveryType) {
        await updateDeliveryType(editingDeliveryType.id, values);
        message.success('Delivery type updated successfully');
      } else {
        await addDeliveryType(values);
        message.success('Delivery type added successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this delivery type?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteDeliveryType(id);
          message.success('Delivery type deleted successfully');
        } catch (error) {
          message.error('An error occurred. Please try again.');
        }
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
        <h2 className="text-2xl font-semibold">Delivery Type Management</h2>
        <Button 
          type="primary" 
          onClick={() => showModal()} 
          icon={<PlusOutlined />}
        >
          Add Delivery Type
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={deliveryTypes} 
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingDeliveryType ? "Edit Delivery Type" : "Add Delivery Type"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Delivery Type Name"
            rules={[{ required: true, message: 'Please input the delivery type name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingDeliveryType ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryTypeList;