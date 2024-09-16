import React, { useState } from 'react';
import { Table, Button, Space, Modal } from 'antd';
import { EyeOutlined, CarOutlined } from '@ant-design/icons';

const ConfirmOrderList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const confirmedOrders = [
    { id: 1, customerName: 'Alice Brown', total: 79.97, items: 3, date: '2023-05-04' },
    { id: 2, customerName: 'Charlie Davis', total: 109.98, items: 5, date: '2023-05-05' },
    { id: 3, customerName: 'Eva Fisher', total: 49.99, items: 2, date: '2023-05-06' },
  ];

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
          <Button icon={<CarOutlined />} onClick={() => console.log('Ship', record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Confirmed Order List</h2>
      <Table columns={columns} dataSource={confirmedOrders} rowKey="id" />
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <div>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
            <p><strong>Items:</strong> {selectedOrder.items}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConfirmOrderList;